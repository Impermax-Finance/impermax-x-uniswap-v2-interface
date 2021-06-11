
import { keccak256 } from '@ethersproject/keccak256';
import { pack } from '@ethersproject/solidity';
import { getCreate2Address } from '@ethersproject/address';

import { UNISWAP_V2_FACTORY_ADDRESSES } from 'config/web3/contracts/uniswap-v2-factory';
import Subgraph from '.';
import { Address } from 'utils/constants';

export function getPairAddress(
  this: Subgraph,
  tokenA: Address,
  tokenB: Address
): string {
  const [token0, token1] = tokenA < tokenB ? [tokenA, tokenB] : [tokenB, tokenA];
  const salt = keccak256(pack(['address', 'address'], [token0, token1]));

  // eslint-disable-next-line no-invalid-this
  const uniswapV2FactoryAddress = UNISWAP_V2_FACTORY_ADDRESSES[this.chainId];
  return getCreate2Address(
    uniswapV2FactoryAddress,
    salt,
    // TODO: hardcoded
    '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f'
  );
}

export function toAPY(this: Subgraph, n: number) : number {
  const SECONDS_IN_YEAR = 365 * 24 * 3600;
  return n * SECONDS_IN_YEAR;
}
