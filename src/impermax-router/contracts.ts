/* eslint-disable no-invalid-this */
// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import ImpermaxRouter from '.';
import { Address, LendingPool, PoolTokenType, Contract, FarmingPool, Claimable } from './interfaces';

export function getLendingPoolCache(this: ImpermaxRouter, uniswapV2PairAddress: Address) {
  if (!(uniswapV2PairAddress in this.lendingPoolCache)) {
    this.lendingPoolCache[uniswapV2PairAddress] = {};
  }
  return this.lendingPoolCache[uniswapV2PairAddress];
}

// ray test touch <<
export async function initializeLendingPool(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address
) : Promise<LendingPool> {
  const lPool = await this.router.getLendingPool(uniswapV2PairAddress);
  const uniswapV2Pair = this.newUniswapV2Pair(uniswapV2PairAddress);
  const tokenAAddress = await uniswapV2Pair.token0();
  const tokenBAddress = await uniswapV2Pair.token1();
  // const tokenAAddress = await uniswapV2Pair.methods.token0().call();
  // const tokenBAddress = await uniswapV2Pair.methods.token1().call();
  const borrowableA = this.newBorrowable(lPool.borrowableA);
  const borrowableB = this.newBorrowable(lPool.borrowableB);
  const farmingPoolAAddress = await borrowableA.borrowTracker();
  const farmingPoolBAddress = await borrowableB.borrowTracker();
  // const farmingPoolAAddress = await borrowableA.methods.borrowTracker().call();
  // const farmingPoolBAddress = await borrowableB.methods.borrowTracker().call();

  return {
    uniswapV2Pair,
    tokenA: this.newERC20(tokenAAddress),
    tokenB: this.newERC20(tokenBAddress),
    collateral: this.newCollateral(lPool.collateral),
    borrowableA,
    borrowableB,
    farmingPoolA:
      farmingPoolAAddress === '0x0000000000000000000000000000000000000000' ? // TODO: hardcoded
        null :
        this.newFarmingPool(farmingPoolAAddress),
    farmingPoolB:
      farmingPoolBAddress === '0x0000000000000000000000000000000000000000' ? // TODO: hardcoded
        null :
        this.newFarmingPool(farmingPoolBAddress)
  };
}
// ray test touch >>

export async function getLendingPool(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<LendingPool> {
  const cache = this.getLendingPoolCache(uniswapV2PairAddress);
  if (!cache.lendingPool) {
    cache.lendingPool = this.initializeLendingPool(uniswapV2PairAddress);
  }
  return cache.lendingPool;
}

// ray test touch <<
export async function getContracts(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  poolTokenType: PoolTokenType
) : Promise<[Contract, Contract]> {
  const lendingPool = await this.getLendingPool(uniswapV2PairAddress);

  if (poolTokenType === PoolTokenType.BorrowableA) {
    return [
      lendingPool.borrowableA,
      lendingPool.tokenA
    ];
  }

  if (poolTokenType === PoolTokenType.BorrowableB) {
    return [
      lendingPool.borrowableB,
      lendingPool.tokenB
    ];
  }

  return [
    lendingPool.collateral,
    lendingPool.uniswapV2Pair
  ];
}
// ray test touch >>

export async function getPoolToken(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<Contract> {
  const [poolToken] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  return poolToken;
}
export async function getToken(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<Contract> {
  const [, token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  return token;
}

// ray test touch <<
export async function getFarmingPool(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  poolTokenType: PoolTokenType
) : Promise<FarmingPool> {
  const lendingPool = await this.getLendingPool(uniswapV2PairAddress);

  if (poolTokenType === PoolTokenType.BorrowableA) {
    return lendingPool.farmingPoolA;
  }

  if (poolTokenType === PoolTokenType.BorrowableB) {
    return lendingPool.farmingPoolB;
  }

  return null;
}
// ray test touch >>

// Claimable
export function getClaimableCache(this: ImpermaxRouter, claimableAddress: Address) {
  if (!(claimableAddress in this.claimableCache)) {
    this.claimableCache[claimableAddress] = {};
  }
  return this.claimableCache[claimableAddress];
}
export async function initializeClaimable(
  this: ImpermaxRouter,
  claimableAddress: Address
) : Promise<Claimable> {
  return this.newClaimable(claimableAddress);
}
export async function getClaimable(
  this: ImpermaxRouter,
  claimableAddress: Address
) : Promise<Claimable> {
  const cache = this.getClaimableCache(claimableAddress);
  if (!cache.contract) cache.contract = this.initializeClaimable(claimableAddress);
  return cache.contract;
}

// Address
export async function getPoolTokenAddress(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  poolTokenType: PoolTokenType
) : Promise<string> {
  const [poolToken] = await this.getContracts(uniswapV2PairAddress, poolTokenType);

  // ray test touch <<
  return poolToken.address;
  // return poolToken._address;
  // ray test touch >>
}

// ray test touch <<
export async function getTokenAddress(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  poolTokenType: PoolTokenType
) : Promise<string> {
  const [, token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  return token.address;
  // return token._address;
}
// ray test touch >>
