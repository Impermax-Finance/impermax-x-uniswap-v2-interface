/* eslint-disable no-invalid-this */
// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import ImpermaxRouter from '.';
import { Address, PoolTokenType } from '../types/interfaces';
import { address } from '../utils/ether-utils';
import { isAddress } from 'ethers/lib/utils';

export function getPoolTokenCache(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  poolTokenType: PoolTokenType
) {
  const cache = this.getLendingPoolCache(uniswapV2PairAddress);
  if (!cache.poolToken) cache.poolToken = {};
  if (!(poolTokenType in cache.poolToken)) cache.poolToken[poolTokenType] = {};
  return cache.poolToken[poolTokenType];
}

// Decimals
export async function initializeTokenDecimals(
  this: ImpermaxRouter,
  tokenAddress: Address
) : Promise<[number, number]> {
  const token = await this.getToken(tokenAddress);
  return parseInt(await token.decimals());
}
export async function getTokenDecimals(
  this: ImpermaxRouter,
  tokenAddress: Address
) : Promise<number> {
  const cache = this.getTokenCache(tokenAddress);
  if (!cache.decimals) cache.decimals = this.initializeTokenDecimals(tokenAddress);
  return cache.decimals;
}
export async function getDecimals(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  poolTokenType: PoolTokenType
) : Promise<number> {
  if (poolTokenType === PoolTokenType.Collateral) return 18;
  const tokenAddress = await this.getTokenAddress(uniswapV2PairAddress, poolTokenType);
  return this.getTokenDecimals(tokenAddress);
}

// ray test touch <<
// Price Denom LP
export async function initializePriceDenomLP(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address
) : Promise<[number, number]> {
  const [collateral] = await this.getContracts(uniswapV2PairAddress, PoolTokenType.Collateral);
  const {
    price0,
    price1
  } = await collateral.callStatic.getPrices();

  const decimalsA = await this.subgraph.getDecimals(uniswapV2PairAddress, PoolTokenType.BorrowableA);
  const decimalsB = await this.subgraph.getDecimals(uniswapV2PairAddress, PoolTokenType.BorrowableB);
  return [
    price0 / 1e18 / 1e18 * Math.pow(10, decimalsA),
    price1 / 1e18 / 1e18 * Math.pow(10, decimalsB)
  ];
}
// ray test touch >>

// ray test touch <<
export async function getPriceDenomLP(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<[number, number]> {
  const cache = this.getLendingPoolCache(uniswapV2PairAddress);
  if (!cache.priceDenomLP) cache.priceDenomLP = this.initializePriceDenomLP(uniswapV2PairAddress);
  return cache.priceDenomLP;
}
// ray test touch >>
export async function getBorrowablePriceDenomLP(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const [priceA, priceB] = await this.getPriceDenomLP(uniswapV2PairAddress);
  if (poolTokenType === PoolTokenType.BorrowableA) return priceA;
  return priceB;
}

// Check Uniswap Pair Address
export async function isValidPair(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<boolean> {
  if (!uniswapV2PairAddress) return false;
  try {
    const contract = this.newUniswapV2Pair(uniswapV2PairAddress);
    const token0 = await contract.token0();
    const token1 = await contract.token1();
    const expectedAddress: Address = await this.uniswapV2Factory.getPair(token0, token1);

    if (expectedAddress.toLowerCase() === uniswapV2PairAddress.toLowerCase()) {
      return true;
    }
    return false;
  } catch (error) {
    console.log('[isValidPair] error.message => ', error.message);
    return false;
  }
}

export async function getPairSymbols(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address
) : Promise<{symbol0: string, symbol1: string}> {
  try {
    const contract = this.newUniswapV2Pair(uniswapV2PairAddress);
    const token0 = await contract.token0();
    const token1 = await contract.token1();
    const token0Contract = this.newERC20(token0);
    const token1Contract = this.newERC20(token1);

    return {
      symbol0: await token0Contract.symbol(),
      symbol1: await token1Contract.symbol()
    };
  } catch (error) {
    console.log('[getPairSymbols] error.message => ', error.message);

    return {
      symbol0: '',
      symbol1: ''
    };
  }
}

export async function isPoolTokenCreated(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  poolTokenType: PoolTokenType
) : Promise<boolean> {
  if (!isAddress(uniswapV2PairAddress)) return false;

  const lendingPool = await this.factory.getLendingPool(uniswapV2PairAddress);

  if (!lendingPool) return false;
  if (isAddress(lendingPool[poolTokenType]) && lendingPool[poolTokenType] !== address(0)) return true;
  return false;
}

export async function isPairInitialized(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address
) : Promise<boolean> {
  if (!isAddress(uniswapV2PairAddress)) return false;

  const lendingPool = await this.factory.getLendingPool(uniswapV2PairAddress);

  if (!lendingPool) return false;
  return lendingPool.initialized;
}
