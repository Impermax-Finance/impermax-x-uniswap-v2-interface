/* eslint-disable no-invalid-this */
// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import { formatUnits } from '@ethersproject/units';

import ImpermaxRouter from '.';
import {
  Address,
  PoolTokenType,
  ClaimEvent
} from '../types/interfaces';

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
  if (farmingPoolA) {
    const bigTotalAmount = await farmingPoolA.claim();
    totalAmount += parseFloat(formatUnits(bigTotalAmount));
  }
  if (farmingPoolB) {
    const bigTotalAmount = await farmingPoolB.claim();
    totalAmount += parseFloat(formatUnits(bigTotalAmount));
  }
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

// ray test touch <<<
// xIMX rate
export async function initializeXIMXRate(this: ImpermaxRouter) : Promise<number> {
  return await this.xIMX.callStatic.exchangeRate() / 1e18;
}
// ray test touch >>>

// ray test touch <<<
export async function getXIMXRate(this: ImpermaxRouter) : Promise<number> {
  if (!this.imxCache.xIMXExchangeRate) this.imxCache.xIMXExchangeRate = await this.initializeXIMXRate();
  return this.imxCache.xIMXExchangeRate;
}
// ray test touch >>>

// xIMX APY
export async function initializeXIMXAPY(this: ImpermaxRouter) : Promise<number> {
  const reservesDistributorBalance = await this.IMX.balanceOf(this.reservesDistributor.address) / 1e18;
  const xImxBalance = await this.IMX.balanceOf(this.xIMX.address) / 1e18;
  const periodLength = await this.reservesDistributor.periodLength();
  const dailyAPR = reservesDistributorBalance / periodLength * 3600 * 24 / xImxBalance;
  return Math.pow(1 + dailyAPR, 365) - 1;
}

export async function getXIMXAPY(this: ImpermaxRouter) : Promise<number> {
  if (!this.imxCache.xIMXAPY) this.imxCache.xIMXAPY = await this.initializeXIMXAPY();
  return this.imxCache.xIMXAPY;
}
