// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import ImpermaxRouter from '.';
import { Address, PoolTokenType } from '../types/interfaces';
import { BigNumber } from '@ethersproject/bignumber';

export async function normalize(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, amount: number) : Promise<number> {
  // eslint-disable-next-line no-invalid-this
  const decimals = await this.subgraph.getDecimals(uniswapV2PairAddress, poolTokenType);
  return amount / Math.pow(10, decimals);
}

export function getDeadline(this: ImpermaxRouter) {
  return BigNumber.from(Math.floor(Date.now() / 1000) + 3600 * 4); // 4 hour deadline
}
