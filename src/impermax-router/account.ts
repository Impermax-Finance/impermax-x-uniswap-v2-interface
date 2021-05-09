/* eslint-disable no-invalid-this */
// ray test touch <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// ray test touch >

import ImpermaxRouter from '.';
import { Address, PoolTokenType, Changes, NO_CHANGES } from './interfaces';

// Exchange rate
export async function initializeExchangeRate(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const [poolToken] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const exchangeRate = await poolToken.methods.exchangeRate().call();
  return exchangeRate / 1e18;
}
export async function getExchangeRate(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const cache = this.getPoolTokenCache(uniswapV2PairAddress, poolTokenType);
  if (!cache.exchangeRate) cache.exchangeRate = this.initializeExchangeRate(uniswapV2PairAddress, poolTokenType);
  return cache.exchangeRate;
}

// Available Balance
export async function initializeAvailableBalance(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const [, token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  // eslint-disable-next-line eqeqeq
  if (token._address == this.WETH) return (await this.web3.eth.getBalance(this.account)) / 1e18 / this.dust;
  const balance = await token.methods.balanceOf(this.account).call();
  return (await this.normalize(uniswapV2PairAddress, poolTokenType, balance)) / this.dust;
}
export async function getAvailableBalance(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const cache = this.getPoolTokenCache(uniswapV2PairAddress, poolTokenType);
  if (!cache.availableBalance) cache.availableBalance = this.initializeAvailableBalance(uniswapV2PairAddress, poolTokenType);
  return cache.availableBalance;
}
export async function getAvailableBalanceUSD(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const availableBalance = await this.getAvailableBalance(uniswapV2PairAddress, poolTokenType);
  const tokenPrice = await this.subgraph.getTokenPrice(uniswapV2PairAddress, poolTokenType);
  return availableBalance * tokenPrice;
}

// Deposited
export async function initializeDeposited(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const [poolToken] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
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
  const tokenPrice = await this.subgraph.getTokenPrice(uniswapV2PairAddress, poolTokenType);
  return deposited * tokenPrice;
}

// Borrowed
export async function initializeBorrowed(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const [borrowable] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const balance = await borrowable.methods.borrowBalance(this.account).call();
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
export async function getBorrowedUSD(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const borrowed = await this.getBorrowed(uniswapV2PairAddress, poolTokenType);
  const tokenPrice = await this.subgraph.getTokenPrice(uniswapV2PairAddress, poolTokenType);
  return borrowed * tokenPrice;
}

// Balance
export async function getBalanceUSD(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<number> {
  const depositedAUSD = await this.getDepositedUSD(uniswapV2PairAddress, PoolTokenType.BorrowableA);
  const depositedBUSD = await this.getDepositedUSD(uniswapV2PairAddress, PoolTokenType.BorrowableB);
  const depositedCUSD = await this.getDepositedUSD(uniswapV2PairAddress, PoolTokenType.Collateral);
  return depositedAUSD + depositedBUSD + depositedCUSD;
}

// Supplied
export async function getSuppliedUSD(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<number> {
  const depositedAUSD = await this.getDepositedUSD(uniswapV2PairAddress, PoolTokenType.BorrowableA);
  const depositedBUSD = await this.getDepositedUSD(uniswapV2PairAddress, PoolTokenType.BorrowableB);
  return depositedAUSD + depositedBUSD;
}

// Debt
export async function getDebtUSD(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<number> {
  const borrowedAUSD = await this.getBorrowedUSD(uniswapV2PairAddress, PoolTokenType.BorrowableA);
  const borrowedBUSD = await this.getBorrowedUSD(uniswapV2PairAddress, PoolTokenType.BorrowableB);
  return borrowedAUSD + borrowedBUSD;
}

// Equity
export async function getEquityUSD(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<number> {
  const balanceUSD = await this.getBalanceUSD(uniswapV2PairAddress);
  const debtUSD = await this.getDebtUSD(uniswapV2PairAddress);
  return balanceUSD - debtUSD;
}
export async function getLPEquityUSD(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<number> {
  const collateralUSD = await this.getDepositedUSD(uniswapV2PairAddress, PoolTokenType.Collateral);
  const debtUSD = await this.getDebtUSD(uniswapV2PairAddress);
  return collateralUSD - debtUSD;
}

// Debt
export async function getAccountAPY(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<number> {
  const depositedAUSD = await this.getDepositedUSD(uniswapV2PairAddress, PoolTokenType.BorrowableA);
  const depositedBUSD = await this.getDepositedUSD(uniswapV2PairAddress, PoolTokenType.BorrowableB);
  const totalSupplied = depositedAUSD + depositedBUSD;
  const supplyAPYA = await this.subgraph.getSupplyAPY(uniswapV2PairAddress, PoolTokenType.BorrowableA);
  const supplyAPYB = await this.subgraph.getSupplyAPY(uniswapV2PairAddress, PoolTokenType.BorrowableB);
  return totalSupplied > 0 ? (depositedAUSD * supplyAPYA + depositedBUSD * supplyAPYB) / totalSupplied : 0;
}

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
export async function getValues(this: ImpermaxRouter, uniswapV2PairAddress: Address, changes: Changes) : Promise<{valueCollateral: number, valueA: number, valueB: number}> {
  const [priceA, priceB] = await this.getPriceDenomLP(uniswapV2PairAddress);
  return this.getValuesFromPrice(uniswapV2PairAddress, changes, priceA, priceB);
}
export async function getMarketValues(this: ImpermaxRouter, uniswapV2PairAddress: Address, changes: Changes) : Promise<{valueCollateral: number, valueA: number, valueB: number}> {
  const [priceA, priceB] = await this.getMarketPriceDenomLP(uniswapV2PairAddress);
  return this.getValuesFromPrice(uniswapV2PairAddress, changes, priceA, priceB);
}

// Leverage
export async function getNewLeverage(this: ImpermaxRouter, uniswapV2PairAddress: Address, changes: Changes) : Promise<number> {
  const { valueCollateral, valueA, valueB } = await this.getValues(uniswapV2PairAddress, changes);
  const valueDebt = valueA + valueB;
  // eslint-disable-next-line eqeqeq
  if (valueDebt == 0) return 1;
  const equity = valueCollateral - valueDebt;
  if (equity <= 0) return Infinity;
  return valueDebt / equity + 1;
}
export async function getLeverage(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<number> {
  return await this.getNewLeverage(uniswapV2PairAddress, NO_CHANGES);
}

// Liquidation Threshold
export async function getNewLiquidationPriceSwings(this: ImpermaxRouter, uniswapV2PairAddress: Address, changes: Changes) : Promise<[number, number]> {
  const { valueCollateral, valueA, valueB } = await this.getValues(uniswapV2PairAddress, changes);
  // eslint-disable-next-line eqeqeq
  if (valueA + valueB == 0) return [Infinity, Infinity];
  const safetyMargin = await this.subgraph.getSafetyMargin(uniswapV2PairAddress);
  const liquidationIncentive = await this.subgraph.getLiquidationIncentive(uniswapV2PairAddress);
  const actualCollateral = valueCollateral / liquidationIncentive;
  const rad = Math.sqrt(actualCollateral ** 2 - 4 * valueA * valueB);
  if (!rad) return [0, 0];
  const t = (actualCollateral + rad) / (2 * Math.sqrt(safetyMargin));
  const priceSwingA = (t / valueA) ** 2;
  const priceSwingB = (t / valueB) ** 2;
  return [priceSwingA, priceSwingB];
}
export async function getNewLiquidationPrices(this: ImpermaxRouter, uniswapV2PairAddress: Address, changes: Changes) : Promise<[number, number]> {
  const currentPrice = await this.getTWAPPrice(uniswapV2PairAddress);
  const [priceSwingA, priceSwingB] = await this.getNewLiquidationPriceSwings(uniswapV2PairAddress, changes);
  // eslint-disable-next-line no-negated-condition
  return !this.priceInverted ? [currentPrice / priceSwingB, currentPrice * priceSwingA] : [currentPrice / priceSwingA, currentPrice * priceSwingB];
}
export async function getLiquidationPriceSwings(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<[number, number]> {
  return await this.getNewLiquidationPriceSwings(uniswapV2PairAddress, NO_CHANGES);
}
export async function getLiquidationPrices(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<[number, number]> {
  return await this.getNewLiquidationPrices(uniswapV2PairAddress, NO_CHANGES);
}

// Max Withdrawable
export async function getMaxWithdrawable(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const deposited = await this.getDeposited(uniswapV2PairAddress, poolTokenType);
  const availableCash = await this.subgraph.getTotalBalance(uniswapV2PairAddress, poolTokenType);
  // eslint-disable-next-line eqeqeq
  if (poolTokenType != PoolTokenType.Collateral) return Math.min(deposited, availableCash) / this.dust;
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
  // eslint-disable-next-line eqeqeq
  const valueBorrowed = poolTokenType == PoolTokenType.BorrowableA ? valueA : valueB;
  // eslint-disable-next-line eqeqeq
  const valueOther = poolTokenType == PoolTokenType.BorrowableA ? valueB : valueA;
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
  // eslint-disable-next-line eqeqeq
  if (equity == 0) return 1;
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
