import { ERC20, Borrowable, LendingPool } from "../hooks/useContract"
import BN from "bn.js";
import { getPairConversionPrices } from '../utils/valueConversion'

function toAPY(n: number) : number {
  const SECONDS_IN_YEAR = 365 * 24 * 3600;
  return n * SECONDS_IN_YEAR / 1e18;
}

export interface BorrowableData {
  tokenAddress: string;
  symbol: string;
  name: string;
  supplyUSD: number;
  borrowedUSD: number;
  utilizationRate: number;
  supplyAPY: number;
  borrowAPY: number;
  //farmingAPY: number;
}

export async function getBorrowableData(token: ERC20, borrowable: Borrowable, tokenPrice: number) : Promise<BorrowableData> {
  const borrowRate = await borrowable.methods.borrowRate().call();
  const totalBorrows = await borrowable.methods.totalBorrows().call();
  const totalBalance = await borrowable.methods.totalBalance().call();
  const supply = totalBalance + totalBorrows;
  const utilizationRate = supply == 0 ? 0 : totalBalance / supply;
  const supplyRate = borrowRate * utilizationRate;
  return {
    tokenAddress: token._address,
    symbol: await token.methods.symbol().call(),
    name: await token.methods.name().call(),
    supplyUSD: supply / 1e18 * tokenPrice,
    borrowedUSD: totalBorrows / 1e18 * tokenPrice,
    utilizationRate: utilizationRate,
    supplyAPY: toAPY(supplyRate),
    borrowAPY: toAPY(borrowRate)
  };
}

export interface BorrowablesData {
  borrowableAData: BorrowableData|null;
  borrowableBData: BorrowableData|null;
}

export async function getBorrowablesData(lendingPool: LendingPool) : Promise<BorrowablesData> {
  if (!lendingPool) return {
    borrowableAData: null,
    borrowableBData: null
  };
  const pairConversionPrices = await getPairConversionPrices(lendingPool.uniswapV2Pair._address);
  return {
    borrowableAData: await getBorrowableData(lendingPool.tokenA, lendingPool.borrowableA, pairConversionPrices.tokenAPrice),
    borrowableBData: await getBorrowableData(lendingPool.tokenB, lendingPool.borrowableB, pairConversionPrices.tokenBPrice)
  };
}