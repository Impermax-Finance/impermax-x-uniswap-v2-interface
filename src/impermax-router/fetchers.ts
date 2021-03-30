import ImpermaxRouter from ".";
import { Address, PoolTokenType, LendingPoolData, BorrowableData } from "./interfaces";
import { decimalToBalance } from "../utils/ether-utils";
import gql from "graphql-tag";
import ApolloClient from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";


export function getPoolTokenCache(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) {
  const cache = this.getLendingPoolCache(uniswapV2PairAddress);
  if (!cache.poolToken) cache.poolToken = {};
  if (!(poolTokenType in cache.poolToken)) cache.poolToken[poolTokenType] = {};
  return cache.poolToken[poolTokenType];
}

// Reserves
export async function initializeReserves(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<[number, number]> {
  const [,uniswapV2Pair] = await this.getContracts(uniswapV2PairAddress, PoolTokenType.Collateral);
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
  const [,uniswapV2Pair] = await this.getContracts(uniswapV2PairAddress, PoolTokenType.Collateral);
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
  const [collateral,] = await this.getContracts(uniswapV2PairAddress, PoolTokenType.Collateral);
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
  if (poolTokenType == PoolTokenType.BorrowableA) return priceA;
  return priceB;
}
export async function getMarketPriceDenomLP(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<[number, number]> {
  const [reserve0, reserve1] = await this.getReserves(uniswapV2PairAddress);
  const totalSupply = await this.getLPTotalSupply(uniswapV2PairAddress);
  return [
    totalSupply / reserve0 / 2,
    totalSupply / reserve1 / 2,
  ];
}
export async function getBorrowableMarketPriceDenomLP(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const [priceA, priceB] = await this.getMarketPriceDenomLP(uniswapV2PairAddress);
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
  const { price } = await this.simpleUniswapOracle.methods.getResult(uniswapV2PairAddress).call();
  const decimalsA = await this.subgraph.getDecimals(uniswapV2PairAddress, PoolTokenType.BorrowableA);
  const decimalsB = await this.subgraph.getDecimals(uniswapV2PairAddress, PoolTokenType.BorrowableB);
  return price / 2**112 * Math.pow(10, decimalsA) / Math.pow(10, decimalsB);
}
export async function getTWAPPrice(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<number> {
  const cache = this.getLendingPoolCache(uniswapV2PairAddress);
  if (!cache.TWAPPrice) cache.TWAPPrice = this.initializeTWAPPrice(uniswapV2PairAddress);
  return !this.priceInverted ? (await cache.TWAPPrice) :  1 / (await cache.TWAPPrice);
}