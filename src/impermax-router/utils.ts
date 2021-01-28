import ImpermaxRouter from ".";
import { Address, PoolTokenType } from "./interfaces";
import { BigNumber } from "ethers";
import { PairConversionPrices, getPairConversionPrices } from "../utils/valueConversion";

export async function normalize(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, amount: number) : Promise<number> {
  const decimals = await this.getDecimals(uniswapV2PairAddress, poolTokenType);
  return amount / Math.pow(10, decimals);
}

export function getDeadline(this: ImpermaxRouter) { //1 hour deadline
  return BigNumber.from(Math.floor(Date.now() / 1000) + 3600);
}

export function toAPY(this: ImpermaxRouter, n: number) : number {
  const SECONDS_IN_YEAR = 365 * 24 * 3600;
  return n * SECONDS_IN_YEAR;
}

export async function getPairConversionPricesInternal(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<PairConversionPrices> {
  const cache = this.getLendingPoolCache(uniswapV2PairAddress);
  if (!cache.pairConversionPrices) cache.pairConversionPrices = getPairConversionPrices(uniswapV2PairAddress, this.convertToMainnet);
  return cache.pairConversionPrices;
}
export async function getTokenPrice(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const pairConversionPrices = await this.getPairConversionPricesInternal(uniswapV2PairAddress);
  if (poolTokenType == PoolTokenType.BorrowableA) return pairConversionPrices.tokenAPrice;
  if (poolTokenType == PoolTokenType.BorrowableB) return pairConversionPrices.tokenBPrice;
  return pairConversionPrices.LPPrice;
}