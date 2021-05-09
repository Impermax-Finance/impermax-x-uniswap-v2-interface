/* eslint-disable no-invalid-this */
// ray test touch <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// ray test touch >

import ImpermaxRouter from '.';
import { Address, PoolTokenType } from './interfaces';
import { address } from '../utils/ether-utils';
import { isAddress } from 'ethers/lib/utils';

export function getPoolTokenCache(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) {
  const cache = this.getLendingPoolCache(uniswapV2PairAddress);
  if (!cache.poolToken) cache.poolToken = {};
  if (!(poolTokenType in cache.poolToken)) cache.poolToken[poolTokenType] = {};
  return cache.poolToken[poolTokenType];
}

// Reserves
export async function initializeReserves(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<[number, number]> {
  const [, uniswapV2Pair] = await this.getContracts(uniswapV2PairAddress, PoolTokenType.Collateral);
  const { reserve0, reserve1 } = await uniswapV2Pair.methods.getReserves().call();
  return [
    await this.normalize(uniswapV2PairAddress, PoolTokenType.BorrowableA, reserve0),
    await this.normalize(uniswapV2PairAddress, PoolTokenType.BorrowableB, reserve1)
  ];
}
export async function getReserves(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<[number, number]> {
  const cache = this.getLendingPoolCache(uniswapV2PairAddress);
  if (!cache.reserves) cache.reserves = this.initializeReserves(uniswapV2PairAddress);
  return cache.reserves;
}

// LP Total Supply
export async function initializeLPTotalSupply(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<number> {
  const [, uniswapV2Pair] = await this.getContracts(uniswapV2PairAddress, PoolTokenType.Collateral);
  const totalSupply = await uniswapV2Pair.methods.totalSupply().call();
  return this.normalize(uniswapV2PairAddress, PoolTokenType.Collateral, totalSupply);
}
export async function getLPTotalSupply(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<number> {
  const cache = this.getLendingPoolCache(uniswapV2PairAddress);
  if (!cache.LPTotalSupply) cache.LPTotalSupply = this.initializeLPTotalSupply(uniswapV2PairAddress);
  return cache.LPTotalSupply;
}

// Price Denom LP
export async function initializePriceDenomLP(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<[number, number]> {
  const [collateral] = await this.getContracts(uniswapV2PairAddress, PoolTokenType.Collateral);
  const { price0, price1 } = await collateral.methods.getPrices().call();
  const decimalsA = await this.subgraph.getDecimals(uniswapV2PairAddress, PoolTokenType.BorrowableA);
  const decimalsB = await this.subgraph.getDecimals(uniswapV2PairAddress, PoolTokenType.BorrowableB);
  return [
    price0 / 1e18 / 1e18 * Math.pow(10, decimalsA),
    price1 / 1e18 / 1e18 * Math.pow(10, decimalsB)
  ];
}
export async function getPriceDenomLP(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<[number, number]> {
  const cache = this.getLendingPoolCache(uniswapV2PairAddress);
  if (!cache.priceDenomLP) cache.priceDenomLP = this.initializePriceDenomLP(uniswapV2PairAddress);
  return cache.priceDenomLP;
}
export async function getBorrowablePriceDenomLP(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const [priceA, priceB] = await this.getPriceDenomLP(uniswapV2PairAddress);
  // eslint-disable-next-line eqeqeq
  if (poolTokenType == PoolTokenType.BorrowableA) return priceA;
  return priceB;
}
export async function getMarketPriceDenomLP(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<[number, number]> {
  const [reserve0, reserve1] = await this.getReserves(uniswapV2PairAddress);
  const totalSupply = await this.getLPTotalSupply(uniswapV2PairAddress);
  return [
    totalSupply / reserve0 / 2,
    totalSupply / reserve1 / 2
  ];
}
export async function getBorrowableMarketPriceDenomLP(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const [priceA, priceB] = await this.getMarketPriceDenomLP(uniswapV2PairAddress);
  // eslint-disable-next-line eqeqeq
  if (poolTokenType == PoolTokenType.BorrowableA) return priceA;
  return priceB;
}

// Market Price
export async function getMarketPrice(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<number> {
  const [reserve0, reserve1] = await this.getReserves(uniswapV2PairAddress);
  return this.priceInverted ? 1 * reserve0 / reserve1 : 1 * reserve1 / reserve0;
}

// TWAP Price
export async function initializeTWAPPrice(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<number> {
  try {
    const { price } = await this.simpleUniswapOracle.methods.getResult(uniswapV2PairAddress).call();
    const decimalsA = await this.subgraph.getDecimals(uniswapV2PairAddress, PoolTokenType.BorrowableA);
    const decimalsB = await this.subgraph.getDecimals(uniswapV2PairAddress, PoolTokenType.BorrowableB);
    return price / 2 ** 112 * Math.pow(10, decimalsA) / Math.pow(10, decimalsB);
  } catch {
    // Oracle is not initialized yet
    return 0;
  }
}
export async function getTWAPPrice(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<number> {
  const cache = this.getLendingPoolCache(uniswapV2PairAddress);
  if (!cache.TWAPPrice) cache.TWAPPrice = this.initializeTWAPPrice(uniswapV2PairAddress);
  // eslint-disable-next-line no-negated-condition
  return !this.priceInverted ? (await cache.TWAPPrice) : 1 / (await cache.TWAPPrice);
}

// Check Uniswap Pair Address
export async function isValidPair(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<boolean> {
  if (!uniswapV2PairAddress) return false;
  try {
    const contract = this.newUniswapV2Pair(uniswapV2PairAddress);
    const token0 = await contract.methods.token0().call();
    const token1 = await contract.methods.token1().call();
    const expectedAddress: Address = await this.uniswapV2Factory.methods.getPair(token0, token1).call();
    if (expectedAddress.toLowerCase() === uniswapV2PairAddress.toLowerCase()) return true;
    return false;
  } catch {
    return false;
  }
}
export async function getPairSymbols(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<{symbol0: string, symbol1: string}> {
  try {
    const contract = this.newUniswapV2Pair(uniswapV2PairAddress);
    const token0 = await contract.methods.token0().call();
    const token1 = await contract.methods.token1().call();
    const token0Contract = this.newERC20(token0);
    const token1Contract = this.newERC20(token1);
    return {
      symbol0: await token0Contract.methods.symbol().call(),
      symbol1: await token1Contract.methods.symbol().call()
    };
  } catch {
    return { symbol0: '', symbol1: '' };
  }
}
export async function isPoolTokenCreated(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<boolean> {
  if (!isAddress(uniswapV2PairAddress)) return false;
  const lendingPool = await this.factory.methods.getLendingPool(uniswapV2PairAddress).call();
  if (!lendingPool) return false;
  // eslint-disable-next-line eqeqeq
  if (isAddress(lendingPool[poolTokenType]) && lendingPool[poolTokenType] != address(0)) return true;
  return false;
}
export async function isPairInitialized(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<boolean> {
  if (!isAddress(uniswapV2PairAddress)) return false;
  const lendingPool = await this.factory.methods.getLendingPool(uniswapV2PairAddress).call();
  if (!lendingPool) return false;
  return lendingPool.initialized;
}
