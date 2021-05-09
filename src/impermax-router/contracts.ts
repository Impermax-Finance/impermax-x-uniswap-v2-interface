/* eslint-disable no-invalid-this */
// ray test touch <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// ray test touch >

import ImpermaxRouter from '.';
import { Address, LendingPool, PoolTokenType, Contract, FarmingPool, Claimable } from './interfaces';

export function getLendingPoolCache(this: ImpermaxRouter, uniswapV2PairAddress: Address) {
  if (!(uniswapV2PairAddress in this.lendingPoolCache)) {
    this.lendingPoolCache[uniswapV2PairAddress] = {};
  }
  return this.lendingPoolCache[uniswapV2PairAddress];
}

export async function initializeLendingPool(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<LendingPool> {
  const lPool = await this.router.methods.getLendingPool(uniswapV2PairAddress).call();
  const uniswapV2Pair = this.newUniswapV2Pair(uniswapV2PairAddress);
  const tokenAAddress = await uniswapV2Pair.methods.token0().call();
  const tokenBAddress = await uniswapV2Pair.methods.token1().call();
  const borrowableA = this.newBorrowable(lPool.borrowableA);
  const borrowableB = this.newBorrowable(lPool.borrowableB);
  const farmingPoolAAddress = await borrowableA.methods.borrowTracker().call();
  const farmingPoolBAddress = await borrowableB.methods.borrowTracker().call();
  return {
    uniswapV2Pair: uniswapV2Pair,
    tokenA: this.newERC20(tokenAAddress),
    tokenB: this.newERC20(tokenBAddress),
    collateral: this.newCollateral(lPool.collateral),
    borrowableA: borrowableA,
    borrowableB: borrowableB,
    farmingPoolA: farmingPoolAAddress === '0x0000000000000000000000000000000000000000' ? null : this.newFarmingPool(farmingPoolAAddress),
    farmingPoolB: farmingPoolBAddress === '0x0000000000000000000000000000000000000000' ? null : this.newFarmingPool(farmingPoolBAddress)
  };
}
export async function getLendingPool(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<LendingPool> {
  const cache = this.getLendingPoolCache(uniswapV2PairAddress);
  if (!cache.lendingPool) cache.lendingPool = this.initializeLendingPool(uniswapV2PairAddress);
  return cache.lendingPool;
}

export async function getContracts(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<[Contract, Contract]> {
  const lendingPool = await this.getLendingPool(uniswapV2PairAddress);
  if (poolTokenType === PoolTokenType.BorrowableA) {
    return [lendingPool.borrowableA, lendingPool.tokenA];
  }
  if (poolTokenType === PoolTokenType.BorrowableB) {
    return [lendingPool.borrowableB, lendingPool.tokenB];
  }
  return [lendingPool.collateral, lendingPool.uniswapV2Pair];
}
export async function getPoolToken(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<Contract> {
  const [poolToken] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  return poolToken;
}
export async function getToken(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<Contract> {
  const [, token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  return token;
}

export async function getFarmingPool(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<FarmingPool> {
  const lendingPool = await this.getLendingPool(uniswapV2PairAddress);
  if (poolTokenType === PoolTokenType.BorrowableA) return lendingPool.farmingPoolA;
  if (poolTokenType === PoolTokenType.BorrowableB) return lendingPool.farmingPoolB;
  return null;
}

// Claimable
export function getClaimableCache(this: ImpermaxRouter, claimableAddress: Address) {
  if (!(claimableAddress in this.claimableCache)) {
    this.claimableCache[claimableAddress] = {};
  }
  return this.claimableCache[claimableAddress];
}
export async function initializeClaimable(this: ImpermaxRouter, claimableAddress: Address) : Promise<Claimable> {
  return this.newClaimable(claimableAddress);
}
export async function getClaimable(this: ImpermaxRouter, claimableAddress: Address) : Promise<Claimable> {
  const cache = this.getClaimableCache(claimableAddress);
  if (!cache.contract) cache.contract = this.initializeClaimable(claimableAddress);
  return cache.contract;
}

// Address
export async function getPoolTokenAddress(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<string> {
  const [poolToken] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  return poolToken._address;
}
export async function getTokenAddress(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<string> {
  const [, token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  return token._address;
}
