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
  Changes,
  NO_CHANGES
} from '../types/interfaces';
import { W_ETH_ADDRESSES } from 'config/web3/contracts/w-eths';

// Exchange rate
export async function initializeExchangeRate(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  poolTokenType: PoolTokenType
) : Promise<number> {
  const [poolToken] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const exchangeRate = await poolToken.callStatic.exchangeRate();

  return exchangeRate / 1e18;
}

export async function getExchangeRate(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const cache = this.getPoolTokenCache(uniswapV2PairAddress, poolTokenType);
  if (!cache.exchangeRate) cache.exchangeRate = this.initializeExchangeRate(uniswapV2PairAddress, poolTokenType);
  return cache.exchangeRate;
}

// Token Available Balance
export async function initializeTokenBalance(
  this: ImpermaxRouter,
  tokenAddress: Address
) : Promise<number> {
  const token = await this.getToken(tokenAddress);
  const wETHAddress = W_ETH_ADDRESSES[this.chainId];
  if (token.address === wETHAddress) {
    const bigBalance = await this.library.getBalance(this.account);
    return parseFloat(formatUnits(bigBalance)) / this.dust;
  }
  const balance = await token.balanceOf(this.account);
  return (await this.normalizeToken(tokenAddress, balance)) / this.dust;
}
export async function getTokenBalance(
  this: ImpermaxRouter,
  tokenAddress: Address
) : Promise<number> {
  const cache = this.getTokenCache(tokenAddress);
  if (!cache.balance) {
    cache.balance = this.initializeTokenBalance(tokenAddress);
  }
  return cache.balance;
}
export async function getAvailableBalance(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  poolTokenType: PoolTokenType
) : Promise<number> {
  const tokenAddress = await this.getTokenAddress(uniswapV2PairAddress, poolTokenType);
  return this.getTokenBalance(tokenAddress);
}

// Deposited
export async function initializeDeposited(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  poolTokenType: PoolTokenType
) : Promise<number> {
  const [poolToken] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const exchangeRate = await this.getExchangeRate(uniswapV2PairAddress, poolTokenType);
  const balance = await poolToken.balanceOf(this.account);

  return (await this.normalize(uniswapV2PairAddress, poolTokenType, balance)) * exchangeRate;
}
export async function getDeposited(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const cache = this.getPoolTokenCache(uniswapV2PairAddress, poolTokenType);
  if (!cache.deposited) cache.deposited = this.initializeDeposited(uniswapV2PairAddress, poolTokenType);
  return cache.deposited;
}

// Borrowed
export async function initializeBorrowed(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  poolTokenType: PoolTokenType
) : Promise<number> {
  const [borrowable] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const balance = await borrowable.borrowBalance(this.account);
  const storedAmount = await this.normalize(uniswapV2PairAddress, poolTokenType, balance);
  const accrualTimestamp = await this.subgraph.getAccrualTimestamp(uniswapV2PairAddress, poolTokenType);
  const borrowRate = await this.subgraph.getBorrowRate(uniswapV2PairAddress, poolTokenType);
  return storedAmount * (1 + (Date.now() / 1000 - accrualTimestamp) * borrowRate);
}
export async function getBorrowed(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const cache = this.getPoolTokenCache(uniswapV2PairAddress, poolTokenType);
  if (!cache.borrowed) cache.borrowed = this.initializeBorrowed(uniswapV2PairAddress, poolTokenType);
  return cache.borrowed;
}

// ray test touch <<<
// Values
export async function getValuesFromPrice(this: ImpermaxRouter, uniswapV2PairAddress: Address, changes: Changes, priceA: number, priceB: number) : Promise<{valueCollateral: number, valueA: number, valueB: number}> {
  const valueCollateral = await this.getDeposited(uniswapV2PairAddress, PoolTokenType.Collateral) + changes.changeCollateral;
  const amountA = await this.getBorrowed(uniswapV2PairAddress, PoolTokenType.BorrowableA) + changes.changeBorrowedA;
  const amountB = await this.getBorrowed(uniswapV2PairAddress, PoolTokenType.BorrowableB) + changes.changeBorrowedB;
  const valueA = amountA * priceA;
  const valueB = amountB * priceB;
  return {
    valueCollateral: valueCollateral > 0 ? valueCollateral : 0,
    valueA: valueA > 0 ? valueA : 0,
    valueB: valueB > 0 ? valueB : 0
  };
}
// ray test touch >>>
// ray test touch <<
export async function getValues(this: ImpermaxRouter, uniswapV2PairAddress: Address, changes: Changes) : Promise<{valueCollateral: number, valueA: number, valueB: number}> {
  const [priceA, priceB] = await this.getPriceDenomLP(uniswapV2PairAddress);
  return this.getValuesFromPrice(uniswapV2PairAddress, changes, priceA, priceB);
}
// ray test touch >>
export async function getMarketValues(this: ImpermaxRouter, uniswapV2PairAddress: Address, changes: Changes) : Promise<{valueCollateral: number, valueA: number, valueB: number}> {
  const [priceA, priceB] = await this.getMarketPriceDenomLP(uniswapV2PairAddress);
  return this.getValuesFromPrice(uniswapV2PairAddress, changes, priceA, priceB);
}

// Max Withdrawable
export async function getMaxWithdrawable(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const deposited = await this.getDeposited(uniswapV2PairAddress, poolTokenType);
  const availableCash = await this.subgraph.getTotalBalance(uniswapV2PairAddress, poolTokenType);
  if (poolTokenType !== PoolTokenType.Collateral) return Math.min(deposited, availableCash) / this.dust;
  const { valueCollateral, valueA, valueB } = await this.getValues(uniswapV2PairAddress, NO_CHANGES);
  const safetyMargin = (await this.subgraph.getSafetyMargin(uniswapV2PairAddress)) * this.uiMargin;
  const liquidationIncentive = await this.subgraph.getLiquidationIncentive(uniswapV2PairAddress);
  const actualCollateral = valueCollateral / liquidationIncentive;
  const maxWithdrawable1 = (actualCollateral - (valueA + valueB * safetyMargin) / Math.sqrt(safetyMargin)) * liquidationIncentive;
  const maxWithdrawable2 = (actualCollateral - (valueB + valueA * safetyMargin) / Math.sqrt(safetyMargin)) * liquidationIncentive;
  return Math.max(0, Math.min(deposited, availableCash, maxWithdrawable1, maxWithdrawable2) / this.dust);
}

// Max Borrowable
export async function getMaxBorrowable(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const availableCash = await this.subgraph.getTotalBalance(uniswapV2PairAddress, poolTokenType);
  const { valueCollateral, valueA, valueB } = await this.getValues(uniswapV2PairAddress, NO_CHANGES);
  const valueBorrowed = poolTokenType === PoolTokenType.BorrowableA ? valueA : valueB;
  const valueOther = poolTokenType === PoolTokenType.BorrowableA ? valueB : valueA;
  const safetyMargin = (await this.subgraph.getSafetyMargin(uniswapV2PairAddress)) * this.uiMargin;
  const liquidationIncentive = await this.subgraph.getLiquidationIncentive(uniswapV2PairAddress);
  const actualCollateral = valueCollateral / liquidationIncentive;
  const totalValueBorrowable1 = (actualCollateral * Math.sqrt(safetyMargin) - valueOther) / safetyMargin;
  const totalValueBorrowable2 = (actualCollateral / Math.sqrt(safetyMargin) - valueOther) * safetyMargin;
  const maxValueBorrowable = Math.min(totalValueBorrowable1, totalValueBorrowable2) - valueBorrowed;
  const price = await this.getBorrowablePriceDenomLP(uniswapV2PairAddress, poolTokenType);
  return Math.max(0, Math.min(availableCash, maxValueBorrowable / price));
}

// Max Leverage
export async function getMaxLeverage(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<number> {
  const availableCashA = await this.subgraph.getTotalBalance(uniswapV2PairAddress, PoolTokenType.BorrowableA);
  const availableCashB = await this.subgraph.getTotalBalance(uniswapV2PairAddress, PoolTokenType.BorrowableB);
  const [priceA, priceB] = await this.getMarketPriceDenomLP(uniswapV2PairAddress);
  const [priceATWAP] = await this.getPriceDenomLP(uniswapV2PairAddress);
  const diff = priceA > priceATWAP ? priceA / priceATWAP : priceATWAP / priceA;
  const adjustFactor = 1 / diff;
  const availableCashValue1 = availableCashA * priceA;
  const availableCashValue2 = availableCashB * priceB;
  const { valueCollateral, valueA, valueB } = await this.getValues(uniswapV2PairAddress, NO_CHANGES);
  const safetyMargin = (await this.subgraph.getSafetyMargin(uniswapV2PairAddress)) * this.uiMargin;
  const liquidationIncentive = await this.subgraph.getLiquidationIncentive(uniswapV2PairAddress);
  const actualCollateral = valueCollateral / liquidationIncentive;
  const num1 = actualCollateral * Math.sqrt(safetyMargin) - valueA * safetyMargin - valueB;
  const num2 = actualCollateral * Math.sqrt(safetyMargin) - valueB * safetyMargin - valueA;
  const den = safetyMargin + 1 - 2 * Math.sqrt(safetyMargin) / liquidationIncentive;
  const additionalValueBorrowablePerSide = Math.min(num1 / den, num2 / den, availableCashValue1, availableCashValue2) * adjustFactor;
  const valueDebt = valueA + valueB;
  const equity = valueCollateral - valueDebt;
  if (equity === 0) return 1;
  return (valueDebt + additionalValueBorrowablePerSide * 2) / equity + 1;
}

// Max Deleverage
export async function getMaxDeleverage(this: ImpermaxRouter, uniswapV2PairAddress: Address, slippage: number) : Promise<number> {
  const { valueCollateral, valueA, valueB } = await this.getMarketValues(uniswapV2PairAddress, NO_CHANGES);
  const minRepayPerSide = valueCollateral / 2 / Math.sqrt(slippage);
  if (minRepayPerSide >= valueA && minRepayPerSide >= valueB) {
    return this.getDeposited(uniswapV2PairAddress, PoolTokenType.Collateral);
  }
  if (minRepayPerSide * 2 < valueA + valueB) {
    return 0;
  }
  return Math.min(valueA, valueB) * 2 * Math.sqrt(slippage);
}
