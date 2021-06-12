/* eslint-disable no-invalid-this */
// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import { BigNumber } from '@ethersproject/bignumber';

import ImpermaxRouter from '.';
import {
  Address,
  AirdropData,
  PoolTokenType,
  ClaimEvent
} from './interfaces';
// ray test touch <<
import { AIR_DROP_URLS } from 'config/web3/endpoints/air-drop';
// ray test touch >>

// Airdrop Data
export async function initializeAirdropData(this: ImpermaxRouter) : Promise<AirdropData> {
  try {
    // ray test touch <<
    const airDropURL = AIR_DROP_URLS[this.chainId];
    const json = await fetch(airDropURL + '/' + this.account);
    // ray test touch >>
    const data = await json.json();
    if (data) {
      data.amount = BigNumber.from(data.amount);
      const isClaimed = await this.merkleDistributor.isClaimed(data.index);
      if (!isClaimed) return data;
    }
  } catch (error) {
    console.log('[initializeAirdropData] error.message => ', error.message);
  }
  return {
    index: -1,
    amount: null,
    proof: []
  };
}

export async function getAirdropData(this: ImpermaxRouter) : Promise<AirdropData> {
  if (!this.imxCache.airdropData) this.imxCache.airdropData = await this.initializeAirdropData();
  return this.imxCache.airdropData;
}

export async function hasClaimableAirdrop(this: ImpermaxRouter) : Promise<boolean> {
  const airdropData = await this.getAirdropData();
  // TODO: double-check
  if (airdropData?.amount) return true;
  return false;
}

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

// Available Reward
export async function initializeAvailableReward(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<number> {
  const farmingPoolA = await this.getFarmingPool(uniswapV2PairAddress, PoolTokenType.BorrowableA);
  const farmingPoolB = await this.getFarmingPool(uniswapV2PairAddress, PoolTokenType.BorrowableB);
  let totalAmount = 0;
  if (farmingPoolA) totalAmount += await farmingPoolA.methods.claim().call({ from: this.account }) / 1e18;
  if (farmingPoolB) totalAmount += await farmingPoolB.methods.claim().call({ from: this.account }) / 1e18;
  return totalAmount;
}
export async function getAvailableReward(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<number> {
  const cache = this.getLendingPoolCache(uniswapV2PairAddress);
  if (!cache.availableReward) cache.availableReward = this.initializeAvailableReward(uniswapV2PairAddress);
  return cache.availableReward;
}

// Claim History
export async function initializeClaimHistory(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<ClaimEvent[]> {
  const farmingPoolA = await this.getFarmingPool(uniswapV2PairAddress, PoolTokenType.BorrowableA);
  const farmingPoolB = await this.getFarmingPool(uniswapV2PairAddress, PoolTokenType.BorrowableB);
  const claimsA = await farmingPoolA.getPastEvents('Claim', { fromBlock: 0, filter: { account: this.account } });
  const claimsB = await farmingPoolB.getPastEvents('Claim', { fromBlock: 0, filter: { account: this.account } });
  const claims = claimsA.concat(claimsB);
  claims.sort((a: any, b: any) => b.blockNumber - a.blockNumber); // order from newest to oldest
  const result: Array<ClaimEvent> = [];
  for (const claim of claims) {
    result.push({
      amount: claim.returnValues.amount / 1e18,
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
