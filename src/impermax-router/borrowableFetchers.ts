import ImpermaxRouter from ".";
import { Address, PoolTokenType } from "./interfaces";
import { BigNumber } from "ethers";


// Reserve Factor
export async function initializeReserveFactor(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const [borrowable,] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const reserveFactor = await borrowable.methods.reserveFactor().call();
  return reserveFactor / 1e18;
}
export async function getReserveFactor(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const cache = this.getPoolTokenCache(uniswapV2PairAddress, poolTokenType);
  if (!cache.reserveFactor) cache.reserveFactor = this.initializeReserveFactor(uniswapV2PairAddress, poolTokenType);
  return cache.reserveFactor;
}

// Kink Borrow Rate
export async function initializeKinkBorrowRate(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const [borrowable,] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const kinkBorrowRate = await borrowable.methods.kinkBorrowRate().call();
  return kinkBorrowRate / 1e18;
}
export async function getKinkBorrowRate(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const cache = this.getPoolTokenCache(uniswapV2PairAddress, poolTokenType);
  if (!cache.kinkBorrowRate) cache.kinkBorrowRate = this.initializeKinkBorrowRate(uniswapV2PairAddress, poolTokenType);
  return cache.kinkBorrowRate;
}

// Kink Utilization Rate
export async function initializeKinkUtilizationRate(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const [borrowable,] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const kinkUtilizationRate = await borrowable.methods.kinkUtilizationRate().call();
  return kinkUtilizationRate / 1e18;
}
export async function getKinkUtilizationRate(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const cache = this.getPoolTokenCache(uniswapV2PairAddress, poolTokenType);
  if (!cache.kinkUtilizationRate) cache.kinkUtilizationRate = this.initializeKinkUtilizationRate(uniswapV2PairAddress, poolTokenType);
  return cache.kinkUtilizationRate;
}

// Accrue Timestamp
export async function initializeAccrualTimestamp(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const [borrowable,] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const accrualTimestamp = await borrowable.methods.accrualTimestamp().call();
  return accrualTimestamp * 1;
}
export async function getAccrualTimestamp(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const cache = this.getPoolTokenCache(uniswapV2PairAddress, poolTokenType);
  if (!cache.accrualTimestamp) cache.accrualTimestamp = this.initializeAccrualTimestamp(uniswapV2PairAddress, poolTokenType);
  return cache.accrualTimestamp;
}

// Total borrows
export async function initializeTotalBorrows(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const [borrowable,] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const totalBorrows = await borrowable.methods.totalBorrows().call();
  return this.normalize(uniswapV2PairAddress, poolTokenType, totalBorrows);
}
export async function getTotalBorrows(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const cache = this.getPoolTokenCache(uniswapV2PairAddress, poolTokenType);
  if (!cache.totalBorrows) cache.totalBorrows = this.initializeTotalBorrows(uniswapV2PairAddress, poolTokenType);
  return cache.totalBorrows;
}
export async function getCurrentTotalBorrows(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const storedAmount = await this.getTotalBorrows(uniswapV2PairAddress, poolTokenType);
  const accrualTimestamp = await this.getAccrualTimestamp(uniswapV2PairAddress, poolTokenType);
  const borrowRate = await this.getBorrowRate(uniswapV2PairAddress, poolTokenType);
  return storedAmount * (1 + (Date.now() / 1000 - accrualTimestamp) * borrowRate);
}
export async function getTotalBorrowsUSD(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const totalBorrows = await this.getCurrentTotalBorrows(uniswapV2PairAddress, poolTokenType);
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
export async function getBorrowAPY(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const borrowRate = await this.getBorrowRate(uniswapV2PairAddress, poolTokenType);
  return this.toAPY(borrowRate);
}
export async function getNextBorrowRate(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, borrowAmount: number) : Promise<number> {
  const totalBorrows = await this.getTotalBorrows(uniswapV2PairAddress, poolTokenType);
  const supply = await this.getSupply(uniswapV2PairAddress, poolTokenType);
  const utilizationRate = (borrowAmount + totalBorrows) / supply;
  const kinkBorrowRate = await this.getKinkBorrowRate(uniswapV2PairAddress, poolTokenType);
  const kinkUtilizationRate = await this.getKinkUtilizationRate(uniswapV2PairAddress, poolTokenType);
  if (utilizationRate < kinkUtilizationRate) return utilizationRate / kinkUtilizationRate * kinkBorrowRate;
  return ((utilizationRate - kinkUtilizationRate) / (1 - kinkUtilizationRate) * 4 + 1) * kinkBorrowRate;
}
export async function getNextBorrowAPY(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, borrowAmount: number) : Promise<number> {
  const borrowRate = await this.getNextBorrowRate(uniswapV2PairAddress, poolTokenType, borrowAmount);
  return this.toAPY(borrowRate);
}

// Supply
export async function getSupply(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const totalBalance = await this.getTotalBalance(uniswapV2PairAddress, poolTokenType);
  const totalBorrows = await this.getTotalBorrows(uniswapV2PairAddress, poolTokenType);
  return totalBalance + totalBorrows;
}
export async function getCurrentSupply(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const storedAmount = await this.getSupply(uniswapV2PairAddress, poolTokenType);
  const accrualTimestamp = await this.getAccrualTimestamp(uniswapV2PairAddress, poolTokenType);
  const supplyRate = await this.getSupplyRate(uniswapV2PairAddress, poolTokenType);
  return storedAmount * (1 + (Date.now() / 1000 - accrualTimestamp) * supplyRate);
}
export async function getSupplyUSD(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const supply = await this.getCurrentSupply(uniswapV2PairAddress, poolTokenType);
  const tokenPrice = await this.getTokenPrice(uniswapV2PairAddress, poolTokenType);
  return supply * tokenPrice;
}

// Utilization Rate
export async function getUtilizationRate(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const supply = await this.getSupply(uniswapV2PairAddress, poolTokenType);
  if (supply == 0) return 0;
  const totalBalance = await this.getTotalBorrows(uniswapV2PairAddress, poolTokenType);
  return totalBalance / supply;
}

// Supply Rate
export async function getSupplyRate(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const borrowRate = await this.getBorrowRate(uniswapV2PairAddress, poolTokenType);
  const utilizationRate = await this.getUtilizationRate(uniswapV2PairAddress, poolTokenType);
  const reserveFactor = await this.getReserveFactor(uniswapV2PairAddress, poolTokenType);
  return borrowRate * utilizationRate * (1 - reserveFactor);
}
export async function getSupplyAPY(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const supplyRate = await this.getSupplyRate(uniswapV2PairAddress, poolTokenType);
  return this.toAPY(supplyRate);
}