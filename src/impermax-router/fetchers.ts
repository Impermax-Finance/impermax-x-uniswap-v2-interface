import ImpermaxRouter from ".";
import { Address, PoolTokenType } from "./interfaces";

export function getPoolTokenCache(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) {
  const cache = this.getLendingPoolCache(uniswapV2PairAddress);
  if (!cache.poolToken) cache.poolToken = {};
  if (!(poolTokenType in cache.poolToken)) cache.poolToken[poolTokenType] = {};
  return cache.poolToken[poolTokenType];
}

// Name
export async function initializeName(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<string> {
  if (poolTokenType == PoolTokenType.Collateral) {
    const nameA = await this.getName(uniswapV2PairAddress, PoolTokenType.BorrowableA);
    const nameB = await this.getName(uniswapV2PairAddress, PoolTokenType.BorrowableB);
    return nameA + '-' + nameB + ' LP';
  }
  return (await this.getContracts(uniswapV2PairAddress, poolTokenType))[1].methods.name().call();
}
export async function getName(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<string> {
  const cache = this.getPoolTokenCache(uniswapV2PairAddress, poolTokenType);
  if (!cache.name) cache.name = this.initializeName(uniswapV2PairAddress, poolTokenType);
  return cache.name;
}

// Symbol
export async function initializeSymbol(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<string> {
  if (poolTokenType == PoolTokenType.Collateral) {
    const symbolA = await this.getSymbol(uniswapV2PairAddress, PoolTokenType.BorrowableA);
    const symbolB = await this.getSymbol(uniswapV2PairAddress, PoolTokenType.BorrowableB);
    return symbolA + '-' + symbolB;
  }
  return (await this.getContracts(uniswapV2PairAddress, poolTokenType))[1].methods.symbol().call();
}
export async function getSymbol(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<string> {
  const cache = this.getPoolTokenCache(uniswapV2PairAddress, poolTokenType);
  if (!cache.symbol) cache.symbol = this.initializeSymbol(uniswapV2PairAddress, poolTokenType);
  return cache.symbol;
}

// Decimals
export async function initializeDecimals(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  if (poolTokenType == PoolTokenType.Collateral) return 18;
  const [,token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const exchangeRate = await token.methods.decimals().call();
  return exchangeRate / 1;
}
export async function getDecimals(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const cache = this.getPoolTokenCache(uniswapV2PairAddress, poolTokenType);
  if (!cache.decimals) cache.decimals = this.initializeDecimals(uniswapV2PairAddress, poolTokenType);
  return cache.decimals;
}

// Exchange rate
export async function initializeExchangeRate(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const [poolToken,] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const exchangeRate = await poolToken.methods.exchangeRate().call();
  return exchangeRate / 1e18;
}
export async function getExchangeRate(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const cache = this.getPoolTokenCache(uniswapV2PairAddress, poolTokenType);
  if (!cache.exchangeRate) cache.exchangeRate = this.initializeExchangeRate(uniswapV2PairAddress, poolTokenType);
  return cache.exchangeRate;
}

// Total balance
export async function initializeTotalBalance(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const [poolToken,] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const amount = await poolToken.methods.totalBalance().call();
  console.log("initializeTotalBalance", amount / 1e18);
  return this.normalize(uniswapV2PairAddress, poolTokenType, amount);
}
export async function getTotalBalance(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const cache = this.getPoolTokenCache(uniswapV2PairAddress, poolTokenType);
  if (!cache.totalBalance) cache.totalBalance = this.initializeTotalBalance(uniswapV2PairAddress, poolTokenType);
  return cache.totalBalance;
}
export async function getTotalBalanceUSD(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const totalBalance = await this.getTotalBalance(uniswapV2PairAddress, poolTokenType);
  const tokenPrice = await this.getTokenPrice(uniswapV2PairAddress, poolTokenType);
  return totalBalance * tokenPrice;
}

// Deposited
export async function initializeDeposited(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const [poolToken,] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const exchangeRate = await this.getExchangeRate(uniswapV2PairAddress, poolTokenType);
  const balance = await poolToken.methods.balanceOf(this.account).call();
  return (await this.normalize(uniswapV2PairAddress, poolTokenType, balance)) * exchangeRate;
}
export async function getDeposited(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const cache = this.getPoolTokenCache(uniswapV2PairAddress, poolTokenType);
  if (!cache.deposited) cache.deposited = this.initializeDeposited(uniswapV2PairAddress, poolTokenType);
  return cache.deposited;
}
export async function getDepositedUSD(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const deposited = await this.getDeposited(uniswapV2PairAddress, poolTokenType);
  const tokenPrice = await this.getTokenPrice(uniswapV2PairAddress, poolTokenType);
  return deposited * tokenPrice;
}