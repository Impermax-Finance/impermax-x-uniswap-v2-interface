/* eslint-disable no-invalid-this */
// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import { formatUnits } from '@ethersproject/units';
import { Web3Provider } from '@ethersproject/providers';
import { Log } from '@ethersproject/abstract-provider';
import { hexZeroPad } from '@ethersproject/bytes';
import { id } from '@ethersproject/hash';
import { Interface } from '@ethersproject/abi';

import ImpermaxRouter from '.';
import {
  Address,
  PoolTokenType,
  ClaimEvent
} from '../types/interfaces';
import FarmingPoolJSON from 'abis/contracts/IFarmingPool.json';

// Farming Shares
export async function initializeFarmingShares(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  poolTokenType: PoolTokenType
) : Promise<number> {
  const farmingPool = await this.getFarmingPool(uniswapV2PairAddress, poolTokenType);
  if (!farmingPool) return 0;
  const { shares } = await farmingPool.recipients(this.account);
  return shares * 1;
}

export async function getFarmingShares(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const cache = this.getPoolTokenCache(uniswapV2PairAddress, poolTokenType);
  if (!cache.farmingShares) cache.farmingShares = this.initializeFarmingShares(uniswapV2PairAddress, poolTokenType);
  return cache.farmingShares;
}

// Claim History
export async function initializeClaimHistory(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address
) : Promise<ClaimEvent[]> {
  const farmingPoolA = await this.getFarmingPool(uniswapV2PairAddress, PoolTokenType.BorrowableA);
  const farmingPoolB = await this.getFarmingPool(uniswapV2PairAddress, PoolTokenType.BorrowableB);
  // MEMO: inspired by https://github.com/ethers-io/ethers.js/issues/52
  const claimsA = await (this.library as Web3Provider).getLogs({
    fromBlock: 0,
    toBlock: 'latest',
    address: farmingPoolA.address,
    topics: [
      id('Claim(address,uint256)'),
      hexZeroPad(this.account, 32)
    ]
  });
  const claimsB = await (this.library as Web3Provider).getLogs({
    fromBlock: 0,
    toBlock: 'latest',
    address: farmingPoolB.address,
    topics: [
      id('Claim(address,uint256)'),
      hexZeroPad(this.account, 32)
    ]
  });
  const claims = claimsA.concat(claimsB);
  claims.sort((a: Log, b: Log) => b.blockNumber - a.blockNumber); // order from newest to oldest
  const result: Array<ClaimEvent> = [];
  const iface = new Interface(FarmingPoolJSON.abi);
  for (const claim of claims) {
    // MEMO: inspired by https://github.com/ethers-io/ethers.js/issues/487
    const logData = iface.parseLog(claim);

    result.push({
      amount: parseFloat(formatUnits(logData.args.amount)),
      transactionHash: claim.transactionHash
    });
  }
  return result;
}
export async function getClaimHistory(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<ClaimEvent[]> {
  const cache = this.getLendingPoolCache(uniswapV2PairAddress);
  if (!cache.claimHistory) cache.claimHistory = this.initializeClaimHistory(uniswapV2PairAddress);
  return cache.claimHistory;
}

// Claim Claimable
export async function initializeAvailableClaimable(
  this: ImpermaxRouter,
  claimableAddress: Address
) : Promise<number> {
  const claimable = await this.getClaimable(claimableAddress);
  return await claimable.claim() / 1e18;
}

export async function getAvailableClaimable(this: ImpermaxRouter, claimableAddress: Address) : Promise<number> {
  const cache = this.getClaimableCache(claimableAddress);
  if (!cache.availableClaimable) cache.availableClaimable = await this.initializeAvailableClaimable(claimableAddress);
  return cache.availableClaimable;
}

