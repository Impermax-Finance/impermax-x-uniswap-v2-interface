import { keccak256, solidityPack, getCreate2Address } from 'ethers/lib/utils';
import Subgraph from '.';
import { Address } from '../utils/constants';

export function getPairAddress(this: Subgraph, tokenA: Address, tokenB: Address) {
  const [token0, token1] = tokenA < tokenB ? [tokenA, tokenB] : [tokenB, tokenA];
  const salt = keccak256(solidityPack(['address', 'address'], [token0, token1]));
  return getCreate2Address(
    // eslint-disable-next-line no-invalid-this
    this.uniswapV2FactoryAddress,
    salt,
    '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f'
  );
}

export function toAPY(this: Subgraph, n: number) : number {
  const SECONDS_IN_YEAR = 365 * 24 * 3600;
  return n * SECONDS_IN_YEAR;
}
