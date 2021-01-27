import ImpermaxRouter from ".";
import { Address, PoolTokenType } from "./interfaces";


// Borrowed
export async function initializeBorrowed(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const [borrowable,] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const exchangeRate = await this.getExchangeRate(uniswapV2PairAddress, poolTokenType);
  const balance = await borrowable.methods.borrowBalance(this.account).call();
  return (await this.normalize(uniswapV2PairAddress, poolTokenType, balance)) * exchangeRate;
}
export async function getBorrowed(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const cache = this.getPoolTokenCache(uniswapV2PairAddress, poolTokenType);
  if (!cache.borrowed) cache.borrowed = this.initializeBorrowed(uniswapV2PairAddress, poolTokenType);
  return cache.borrowed;
}
export async function getBorrowedUSD(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const borrowed = await this.getBorrowed(uniswapV2PairAddress, poolTokenType);
  const tokenPrice = await this.getTokenPrice(uniswapV2PairAddress, poolTokenType);
  return borrowed * tokenPrice;
}

// Total borrows
export async function initializeTotalBorrows(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const [borrowable,] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const amount = await borrowable.methods.totalBorrows().call();
  return this.normalize(uniswapV2PairAddress, poolTokenType, amount);
}
export async function getTotalBorrows(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const cache = this.getPoolTokenCache(uniswapV2PairAddress, poolTokenType);
  if (!cache.totalBorrows) cache.totalBorrows = this.initializeTotalBorrows(uniswapV2PairAddress, poolTokenType);
  return cache.totalBorrows;
}
export async function getTotalBorrowsUSD(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const totalBorrows = await this.getTotalBorrows(uniswapV2PairAddress, poolTokenType);
  const tokenPrice = await this.getTokenPrice(uniswapV2PairAddress, poolTokenType);
  return totalBorrows * tokenPrice;
}

// Borrow rate
export async function initializeBorrowRate(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const [borrowable,] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const borrowRate = await borrowable.methods.borrowRate().call();
  return borrowRate / 1e18;
}
export async function getBorrowRate(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const cache = this.getPoolTokenCache(uniswapV2PairAddress, poolTokenType);
  if (!cache.borrowRate) cache.borrowRate = this.initializeBorrowRate(uniswapV2PairAddress, poolTokenType);
  return cache.borrowRate;
}

// Supply
export async function getSupply(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const totalBalance = await this.getTotalBalance(uniswapV2PairAddress, poolTokenType);
  const totalBorrows = await this.getTotalBorrows(uniswapV2PairAddress, poolTokenType);
  console.log("getSupply", totalBalance, totalBorrows);
  return totalBalance + totalBorrows;
}
export async function getSupplyUSD(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const supply = await this.getSupply(uniswapV2PairAddress, poolTokenType);
  const tokenPrice = await this.getTokenPrice(uniswapV2PairAddress, poolTokenType);
  console.log("getSupplyUSD", supply, tokenPrice, supply * tokenPrice);
  return supply * tokenPrice;
}

// Utilization Rate
export async function getUtilizationRate(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const supply = await this.getSupply(uniswapV2PairAddress, poolTokenType);
  if (supply == 0) return 0;
  const totalBalance = await this.getTotalBalance(uniswapV2PairAddress, poolTokenType);
  return totalBalance / supply;
}

// Supply Rate
export async function getSupplyRate(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const borrowRate = await this.getBorrowRate(uniswapV2PairAddress, poolTokenType);
  const utilizationRate = await this.getUtilizationRate(uniswapV2PairAddress, poolTokenType);
  console.log("getSupplyRate", borrowRate, utilizationRate);
  return borrowRate * utilizationRate;
}