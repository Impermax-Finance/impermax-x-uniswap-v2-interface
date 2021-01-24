import { ERC20, Borrowable, LendingPool } from "../hooks/useContract"
import { getPairConversionPrices } from '../utils/valueConversion'

export interface AccountBorrowableData {
  tokenAddress: string;
  symbol: string;
  borrowed: number;
  borrowedUSD: number;
  deposited: number;
  depositedUSD: number;
}

export interface AccountCollateralData {
  tokenAAddress: string;
  tokenBAddress: string;
  symbolA: string;
  symbolB: string;
  deposited: number;
  depositedUSD: number;
}

export interface RiskMetrics {
  //Todo
}

export interface AccountData {
  equityUSD: number;
  balanceUSD: number;
  debtUSD: number;
  riskMetrics: RiskMetrics;
  accountBorrowableAData: AccountBorrowableData;
  accountBorrowableBData: AccountBorrowableData;
  accountCollateralData: AccountCollateralData;
}

export async function getAccountData(account: string, lendingPool: LendingPool) : Promise<AccountData> {
  const pairConversionPrices = await getPairConversionPrices(lendingPool.uniswapV2Pair._address);
  const symbolA = await lendingPool.tokenA.methods.symbol().call();
  const symbolB = await lendingPool.tokenB.methods.symbol().call();
  const borrowedA = await lendingPool.borrowableA.methods.borrowBalance(account).call() / 1e18;
  const borrowedB = await lendingPool.borrowableB.methods.borrowBalance(account).call() / 1e18;
  const borrowedAUSD = borrowedA * pairConversionPrices.tokenAPrice;
  const borrowedBUSD = borrowedB * pairConversionPrices.tokenBPrice;
  const exchangeRateA = await lendingPool.borrowableA.methods.exchangeRate().call() / 1e18;
  const exchangeRateB = await lendingPool.borrowableB.methods.exchangeRate().call() / 1e18;
  const exchangeRateCollateral = await lendingPool.collateral.methods.exchangeRate().call() / 1e18;
  const balanceA = await lendingPool.borrowableA.methods.balanceOf(account).call();
  const balanceB = await lendingPool.borrowableB.methods.balanceOf(account).call();
  const balanceCollateral = await lendingPool.collateral.methods.balanceOf(account).call();
  const decimalsA = await lendingPool.tokenA.methods.decimals().call();
  const decimalsB = await lendingPool.tokenB.methods.decimals().call();
  const depositedA = balanceA * exchangeRateA / Math.pow(10, decimalsA);
  const depositedB = balanceB * exchangeRateB / Math.pow(10, decimalsB);
  const depositedCollateral = balanceCollateral * exchangeRateCollateral / 1e18;
  const depositedAUSD = depositedA * pairConversionPrices.tokenAPrice;
  const depositedBUSD = depositedB * pairConversionPrices.tokenBPrice;
  const depositedCollateralUSD = depositedCollateral * pairConversionPrices.LPPrice;
  const balanceUSD = depositedAUSD + depositedBUSD + depositedCollateralUSD;
  const debtUSD = borrowedAUSD + borrowedBUSD;
  const equityUSD = balanceUSD - debtUSD;

  const accountBorrowableAData = {
    tokenAddress: lendingPool.tokenA._address,
    symbol: symbolA,
    borrowed: borrowedA,
    borrowedUSD: borrowedAUSD,
    deposited: depositedA,
    depositedUSD: depositedAUSD
  };
  const accountBorrowableBData = {
    tokenAddress: lendingPool.tokenB._address,
    symbol: symbolB,
    borrowed: borrowedB,
    borrowedUSD: borrowedBUSD,
    deposited: depositedB,
    depositedUSD: depositedBUSD
  };
  const accountCollateralData = {
    tokenAAddress: lendingPool.tokenA._address,
    tokenBAddress: lendingPool.tokenB._address,
    symbolA: symbolA,
    symbolB: symbolB,
    deposited: symbolB,
    depositedUSD: depositedAUSD
  };
  return {
    equityUSD: equityUSD,
    balanceUSD: balanceUSD,
    debtUSD: debtUSD,
    riskMetrics: {},
    accountBorrowableAData: accountBorrowableAData,
    accountBorrowableBData: accountBorrowableBData,
    accountCollateralData: accountCollateralData,
  }
}