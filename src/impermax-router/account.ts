import ImpermaxRouter from ".";
import { Address, PoolTokenType } from "./interfaces";


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

// Leverage
export async function getLeverage(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<number> {
  const collateralUSD = await this.getDepositedUSD(uniswapV2PairAddress, PoolTokenType.Collateral);
  const debtUSD = await this.getDebtUSD(uniswapV2PairAddress);
  const equity = collateralUSD - debtUSD;
  if (equity == 0) return 1;
  return debtUSD / equity + 1;
}

// Liquidation Threshold
export async function getLiquidationPriceSwings(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<[number, number]> {
  const safetyMargin = await this.getSafetyMargin(uniswapV2PairAddress);
  const liquidationIncentive = await this.getLiquidationIncentive(uniswapV2PairAddress);
  const [priceA, priceB] = await this.getPriceDenomLP(uniswapV2PairAddress);
  const valueCollateral = await this.getDeposited(uniswapV2PairAddress, PoolTokenType.Collateral);
  const amountA = await this.getBorrowed(uniswapV2PairAddress, PoolTokenType.BorrowableA);
  const amountB = await this.getBorrowed(uniswapV2PairAddress, PoolTokenType.BorrowableB);
  const valueA = amountA * priceA;
  const valueB = amountB * priceB;
	const actualCollateral = valueCollateral / liquidationIncentive;
	const rad = Math.sqrt(actualCollateral ** 2 - 4 * valueA * valueB);
	const t = (actualCollateral + rad) / (2 * Math.sqrt(safetyMargin));
	const priceSwingA = (t / valueA) ** 2;
	const priceSwingB = (t / valueB) ** 2;
	return [priceSwingA, priceSwingB];
}
export async function getLiquidationPrices(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<[number, number]> {
  const currentPrice = await this.getTWAPPrice(uniswapV2PairAddress);
	const [priceSwingA, priceSwingB] = await this.getLiquidationPriceSwings(uniswapV2PairAddress);
	return [currentPrice / priceSwingA, currentPrice * priceSwingB];
}