import ImpermaxRouter from ".";
import { Address, PoolTokenType } from "./interfaces";
import { BigNumber } from "ethers";
import { ROPSTEN_ETH_DAI, ROPSTEN_ETH_UNI } from "../utils/constants";

export async function normalize(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, amount: number) : Promise<number> {
  const decimals = await this.subgraph.getDecimals(uniswapV2PairAddress, poolTokenType);
  return amount / Math.pow(10, decimals);
}

export function getDeadline(this: ImpermaxRouter) {
  return BigNumber.from(Math.floor(Date.now() / 1000) + 3600 * 4); //4 hour deadline
}

export function toAPY(this: ImpermaxRouter, n: number) : number {
  const SECONDS_IN_YEAR = 365 * 24 * 3600;
  return n * SECONDS_IN_YEAR;
}