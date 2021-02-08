import ImpermaxRouter from ".";
import { Address, PoolTokenType } from "./interfaces";


// Available Balance
export async function initializeAvailableBalance(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const [,token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  if (token._address == this.WETH) return (await this.web3.eth.getBalance(this.account)) / 1e18 / this.dust;
  const balance = await token.methods.balanceOf(this.account).call();
  return (await this.normalize(uniswapV2PairAddress, poolTokenType, balance)) / this.dust;
}
export async function getAvailableBalance(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const cache = this.getPoolTokenCache(uniswapV2PairAddress, poolTokenType);
  if (!cache.availableBalance) cache.availableBalance = this.initializeAvailableBalance(uniswapV2PairAddress, poolTokenType);
  return cache.availableBalance;
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

// Borrowed
export async function initializeBorrowed(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const [borrowable,] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const exchangeRate = await this.getExchangeRate(uniswapV2PairAddress, poolTokenType);
  const balance = await borrowable.methods.borrowBalance(this.account).call();
  const storedAmount = (await this.normalize(uniswapV2PairAddress, poolTokenType, balance)) * exchangeRate;
  const accrualTimestamp = await this.getAccrualTimestamp(uniswapV2PairAddress, poolTokenType);
  const borrowRate = await this.getBorrowRate(uniswapV2PairAddress, poolTokenType);
  return storedAmount * (1 + (Date.now() / 1000 - accrualTimestamp) * borrowRate);
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

// Balance
export async function getBalanceUSD(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<number> {
  const depositedAUSD = await this.getDepositedUSD(uniswapV2PairAddress, PoolTokenType.BorrowableA);
  const depositedBUSD = await this.getDepositedUSD(uniswapV2PairAddress, PoolTokenType.BorrowableB);
  const depositedCUSD = await this.getDepositedUSD(uniswapV2PairAddress, PoolTokenType.Collateral);
  return depositedAUSD + depositedBUSD + depositedCUSD;
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

// Values
export async function getValues(
  this: ImpermaxRouter, 
  uniswapV2PairAddress: Address, 
  changeBorrowedA: number, 
  changeBorrowedB: number, 
  changeCollateral: number
) : Promise<{valueCollateral: number, valueA: number, valueB: number}> {
  const [priceA, priceB] = await this.getPriceDenomLP(uniswapV2PairAddress);
  const valueCollateral = await this.getDeposited(uniswapV2PairAddress, PoolTokenType.Collateral) + changeCollateral;
  const amountA = await this.getBorrowed(uniswapV2PairAddress, PoolTokenType.BorrowableA) + changeBorrowedA;
  const amountB = await this.getBorrowed(uniswapV2PairAddress, PoolTokenType.BorrowableB) + changeBorrowedB;
  const valueA = amountA * priceA;
  const valueB = amountB * priceB;
  return { 
    valueCollateral: valueCollateral > 0 ? valueCollateral : 0, 
    valueA: valueA > 0 ? valueA : 0, 
    valueB: valueB > 0 ? valueB : 0,
  };
}

// Leverage
export async function getNewLeverage(
  this: ImpermaxRouter, 
  uniswapV2PairAddress: Address, 
  changeBorrowedA: number, 
  changeBorrowedB: number, 
  changeCollateral: number
) : Promise<number> {
  const { valueCollateral, valueA, valueB } = await this.getValues(uniswapV2PairAddress, changeBorrowedA, changeBorrowedB, changeCollateral);
  const valueDebt = valueA + valueB;
  if (valueDebt == 0) return 1;
  const equity = valueCollateral - valueDebt;
  if (equity <= 0) return Infinity;
  return valueDebt / equity + 1;
}
export async function getLeverage(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<number> {
  return await this.getNewLeverage(uniswapV2PairAddress, 0, 0, 0);
}

// Liquidation Threshold
export async function getNewLiquidationPriceSwings(
  this: ImpermaxRouter, 
  uniswapV2PairAddress: Address, 
  changeBorrowedA: number, 
  changeBorrowedB: number, 
  changeCollateral: number
) : Promise<[number, number]> {
  const { valueCollateral, valueA, valueB } = await this.getValues(uniswapV2PairAddress, changeBorrowedA, changeBorrowedB, changeCollateral);
  if (valueA + valueB == 0) return [Infinity, Infinity];
  const safetyMargin = await this.getSafetyMargin(uniswapV2PairAddress);
  const liquidationIncentive = await this.getLiquidationIncentive(uniswapV2PairAddress);
  const actualCollateral = valueCollateral / liquidationIncentive;
  const rad = Math.sqrt(actualCollateral ** 2 - 4 * valueA * valueB);
  if (!rad) return [0, 0];
	const t = (actualCollateral + rad) / (2 * Math.sqrt(safetyMargin));
	let priceSwingA = (t / valueA) ** 2;
  let priceSwingB = (t / valueB) ** 2;
	return [priceSwingA, priceSwingB];
}
export async function getNewLiquidationPrices(
  this: ImpermaxRouter, 
  uniswapV2PairAddress: Address, 
  changeBorrowedA: number, 
  changeBorrowedB: number, 
  changeCollateral: number
) : Promise<[number, number]> {
  const currentPrice = await this.getTWAPPrice(uniswapV2PairAddress);
  const [priceSwingA, priceSwingB] = await this.getNewLiquidationPriceSwings(uniswapV2PairAddress, changeBorrowedA, changeBorrowedB, changeCollateral);
	return [currentPrice / priceSwingB, currentPrice * priceSwingA];
}
export async function getLiquidationPriceSwings(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<[number, number]> {
  return await this.getNewLiquidationPriceSwings(uniswapV2PairAddress, 0, 0, 0);
}
export async function getLiquidationPrices(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<[number, number]> {
  return await this.getNewLiquidationPrices(uniswapV2PairAddress, 0, 0, 0);
}

// Max Withdrawable
export async function getMaxWithdrawable(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const deposited = await this.getDeposited(uniswapV2PairAddress, poolTokenType);
  const availableCash = await this.getTotalBalance(uniswapV2PairAddress, poolTokenType);
  if (poolTokenType != PoolTokenType.Collateral) return Math.min(deposited, availableCash) / this.dust;
  const { valueCollateral, valueA, valueB } = await this.getValues(uniswapV2PairAddress, 0, 0, 0);
  const safetyMargin = (await this.getSafetyMargin(uniswapV2PairAddress)) * this.uiMargin;
  const liquidationIncentive = await this.getLiquidationIncentive(uniswapV2PairAddress);
  const actualCollateral = valueCollateral / liquidationIncentive;
  const maxWithdrawable1 = (actualCollateral - (valueA + valueB * safetyMargin) / Math.sqrt(safetyMargin)) * liquidationIncentive;
  const maxWithdrawable2 = (actualCollateral - (valueB + valueA * safetyMargin) / Math.sqrt(safetyMargin)) * liquidationIncentive;
  return Math.min(deposited, availableCash, maxWithdrawable1, maxWithdrawable2) / this.dust;
}

// Max Borrowable
export async function getMaxBorrowable(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const availableCash = await this.getTotalBalance(uniswapV2PairAddress, poolTokenType);
  const { valueCollateral, valueA, valueB } = await this.getValues(uniswapV2PairAddress, 0, 0, 0);
  const valueBorrowed = poolTokenType == PoolTokenType.BorrowableA ? valueA : valueB;
  const valueOther = poolTokenType == PoolTokenType.BorrowableA ? valueB : valueA;
  const safetyMargin = (await this.getSafetyMargin(uniswapV2PairAddress)) * this.uiMargin;
  const liquidationIncentive = await this.getLiquidationIncentive(uniswapV2PairAddress);
  const actualCollateral = valueCollateral / liquidationIncentive;
  const totalValueBorrowable1 = (actualCollateral * Math.sqrt(safetyMargin) - valueOther) / safetyMargin;
  const totalValueBorrowable2 = (actualCollateral / Math.sqrt(safetyMargin) - valueOther) * safetyMargin;
  const maxValueBorrowable = Math.min(totalValueBorrowable1, totalValueBorrowable2) - valueBorrowed;
  const price = await this.getBorrowablePriceDenomLP(uniswapV2PairAddress, poolTokenType);
  return Math.min(availableCash, maxValueBorrowable / price);
}

// Max Leverage
export async function getMaxLeverage(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<number> {
  const availableCash1 = await this.getTotalBalance(uniswapV2PairAddress, PoolTokenType.BorrowableA);
  const availableCash2 = await this.getTotalBalance(uniswapV2PairAddress, PoolTokenType.BorrowableB);
  const price1 = await this.getBorrowablePriceDenomLP(uniswapV2PairAddress, PoolTokenType.BorrowableA);
  const price2 = await this.getBorrowablePriceDenomLP(uniswapV2PairAddress, PoolTokenType.BorrowableB);
  const availableCashValue1 = availableCash1 * price1;
  const availableCashValue2 = availableCash2 * price2;
  const { valueCollateral, valueA, valueB } = await this.getValues(uniswapV2PairAddress, 0, 0, 0);
  const safetyMargin = (await this.getSafetyMargin(uniswapV2PairAddress)) * this.uiMargin;
  const liquidationIncentive = await this.getLiquidationIncentive(uniswapV2PairAddress);
  const actualCollateral = valueCollateral / liquidationIncentive;
  const num1 = actualCollateral * Math.sqrt(safetyMargin) - valueA * safetyMargin - valueB;
  const num2 = actualCollateral * Math.sqrt(safetyMargin) - valueB * safetyMargin - valueA;
  const den = safetyMargin + 1 - 2 * Math.sqrt(safetyMargin) / liquidationIncentive;
  const additionalValueBorrowablePerSide = Math.min(num1 / den, num2 / den, availableCashValue1, availableCashValue2);
  const valueDebt = valueA + valueB;
  const equity = valueCollateral - valueDebt;
  if (equity == 0) return 1;
  return (valueDebt + additionalValueBorrowablePerSide * 2) / equity + 1;
}