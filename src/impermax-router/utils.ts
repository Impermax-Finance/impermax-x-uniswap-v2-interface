import ImpermaxRouter from ".";
import { Address, PoolTokenType } from "./interfaces";
import { BigNumber } from "ethers";
import { PairConversionPrices, getPairConversionPrices } from "../utils/valueConversion";
import { ROPSTEN_ETH_DAI, ROPSTEN_ETH_UNI } from "../utils/constants";
import { getWeeklyUniswapAPY } from "../utils/uniswapApy";

export async function normalize(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, amount: number) : Promise<number> {
  const decimals = await this.getDecimals(uniswapV2PairAddress, poolTokenType);
  return amount / Math.pow(10, decimals);
}

export function getDeadline(this: ImpermaxRouter) {
  return BigNumber.from(Math.floor(Date.now() / 1000) + 3600 * 4); //4 hour deadline
}

export function toAPY(this: ImpermaxRouter, n: number) : number {
  const SECONDS_IN_YEAR = 365 * 24 * 3600;
  return n * SECONDS_IN_YEAR;
}

export async function initializePairConversionPricesRopsten(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<PairConversionPrices> {
  const [,uniswapV2Pair] = await this.getContracts(uniswapV2PairAddress, PoolTokenType.Collateral);
  const ETHPrice = 1 / (await this.getMarketPrice(ROPSTEN_ETH_DAI));
  const totalSupply = await uniswapV2Pair.methods.totalSupply().call();
  const { reserve0, reserve1 } = await uniswapV2Pair.methods.getReserves().call();
  const [,tokenA] = await this.getContracts(uniswapV2PairAddress, PoolTokenType.BorrowableA);
  if (tokenA._address === this.WETH) {
    const ETHReserves = reserve0;
    const decimals = await this.getDecimals(uniswapV2PairAddress, PoolTokenType.BorrowableB);
    const otherPrice = ETHPrice * reserve0 / reserve1 * Math.pow(10, decimals) / 1e18;
    return {
      LPPrice: 2 * ETHReserves / totalSupply * ETHPrice,
      tokenAPrice: ETHPrice,
      tokenBPrice: otherPrice,
    };
  }
  else {
    const ETHReserves = reserve1;
    const decimals = await this.getDecimals(uniswapV2PairAddress, PoolTokenType.BorrowableA);
    const otherPrice = ETHPrice * reserve1 / reserve0 * Math.pow(10, decimals) / 1e18;
    return {
      LPPrice: 2 * ETHReserves / totalSupply * ETHPrice,
      tokenAPrice: otherPrice,
      tokenBPrice: ETHPrice,
    };
  }
}
export async function getPairConversionPricesInternal(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<PairConversionPrices> {
  const cache = this.getLendingPoolCache(uniswapV2PairAddress);
  if (!cache.pairConversionPrices) {
    if (this.chainId == 3) cache.pairConversionPrices = this.initializePairConversionPricesRopsten(uniswapV2PairAddress);
    else cache.pairConversionPrices = getPairConversionPrices(uniswapV2PairAddress);
  }
  return cache.pairConversionPrices;
}
export async function getTokenPrice(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const pairConversionPrices = await this.getPairConversionPricesInternal(uniswapV2PairAddress);
  if (poolTokenType == PoolTokenType.BorrowableA) return pairConversionPrices.tokenAPrice;
  if (poolTokenType == PoolTokenType.BorrowableB) return pairConversionPrices.tokenBPrice;
  return pairConversionPrices.LPPrice;
}

export async function getUniswapAPY(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<number> {
  const cache = this.getLendingPoolCache(uniswapV2PairAddress);
  if (!cache.uniswapApy) cache.uniswapApy = getWeeklyUniswapAPY(uniswapV2PairAddress);
  return cache.uniswapApy;
}