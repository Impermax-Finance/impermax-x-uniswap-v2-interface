import ImpermaxRouter from ".";
import { Address, PoolTokenType, BorrowableData, AccountBorrowableData, AccountCollateralData, AccountData, RiskMetrics } from "./interfaces";

export async function getBorrowableData(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<BorrowableData> {
  return {
    tokenAddress: await this.getTokenAddress(uniswapV2PairAddress, poolTokenType),
    symbol: await this.getSymbol(uniswapV2PairAddress, poolTokenType),
    name: await this.getName(uniswapV2PairAddress, poolTokenType),
    supplyUSD: await this.getSupplyUSD(uniswapV2PairAddress, poolTokenType),
    totalBorrowsUSD: await this.getTotalBorrowsUSD(uniswapV2PairAddress, poolTokenType),
    utilizationRate: await this.getUtilizationRate(uniswapV2PairAddress, poolTokenType),
    supplyAPY: await this.getSupplyAPY(uniswapV2PairAddress, poolTokenType),
    borrowAPY: await this.getBorrowAPY(uniswapV2PairAddress, poolTokenType),
  };
}

export async function getAccountBorrowableData(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<AccountBorrowableData> {
  if (!this.account) return null;
  return {
    tokenAddress: await this.getTokenAddress(uniswapV2PairAddress, poolTokenType),
    borrowableAddress: await this.getPoolTokenAddress(uniswapV2PairAddress, poolTokenType),
    symbol: await this.getSymbol(uniswapV2PairAddress, poolTokenType),
    decimals: await this.getDecimals(uniswapV2PairAddress, poolTokenType),
    borrowed: await this.getBorrowed(uniswapV2PairAddress, poolTokenType),
    borrowedUSD: await this.getBorrowedUSD(uniswapV2PairAddress, poolTokenType),
    deposited: await this.getDeposited(uniswapV2PairAddress, poolTokenType),
    depositedUSD: await this.getDepositedUSD(uniswapV2PairAddress, poolTokenType),
  };
}

export async function getAccountCollateralData(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<AccountCollateralData> {
  if (!this.account) return null;
  return {
    tokenAAddress: await this.getTokenAddress(uniswapV2PairAddress, PoolTokenType.BorrowableA),
    tokenBAddress: await this.getTokenAddress(uniswapV2PairAddress, PoolTokenType.BorrowableB),
    collateralAddress: await this.getPoolTokenAddress(uniswapV2PairAddress, PoolTokenType.Collateral),
    symbolA: await this.getSymbol(uniswapV2PairAddress, PoolTokenType.BorrowableA),
    symbolB: await this.getSymbol(uniswapV2PairAddress, PoolTokenType.BorrowableB),
    decimals: 18,
    deposited: await this.getDeposited(uniswapV2PairAddress, PoolTokenType.Collateral),
    depositedUSD: await this.getDepositedUSD(uniswapV2PairAddress, PoolTokenType.Collateral),
  };
}

export async function getNewRiskMetrics(
  this: ImpermaxRouter, 
  uniswapV2PairAddress: Address, 
  changeBorrowedA: number, 
  changeBorrowedB: number, 
  changeCollateral: number
) : Promise<RiskMetrics> {
  if (!this.account) return null;
  return {
    leverage: await this.getNewLeverage(uniswapV2PairAddress, changeBorrowedA, changeBorrowedB, changeCollateral),
    liquidationPrices: await this.getNewLiquidationPrices(uniswapV2PairAddress, changeBorrowedA, changeBorrowedB, changeCollateral),
    marketPrice: await this.getMarketPrice(uniswapV2PairAddress),
    TWAPPrice: await this.getTWAPPrice(uniswapV2PairAddress),
    safetyMargin: await this.getSafetyMargin(uniswapV2PairAddress),
  };
}
export async function getRiskMetrics(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<RiskMetrics> {
  return this.getNewRiskMetrics(uniswapV2PairAddress, 0, 0, 0);
}


export async function getAccountData(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<AccountData> {
  if (!this.account) return null;
  return {
    symbolA: await this.getSymbol(uniswapV2PairAddress, PoolTokenType.BorrowableA),
    symbolB: await this.getSymbol(uniswapV2PairAddress, PoolTokenType.BorrowableB),
    equityUSD: await this.getEquityUSD(uniswapV2PairAddress),
    balanceUSD: await this.getBalanceUSD(uniswapV2PairAddress),
    debtUSD: await this.getDebtUSD(uniswapV2PairAddress),
    riskMetrics: await this.getRiskMetrics(uniswapV2PairAddress),
  }
}