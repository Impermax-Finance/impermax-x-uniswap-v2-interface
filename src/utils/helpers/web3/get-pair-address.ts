
// TODO: could be a hook
import { keccak256 } from '@ethersproject/keccak256';
import { pack } from '@ethersproject/solidity';
import { getCreate2Address } from '@ethersproject/address';

import { UNISWAP_V2_FACTORY_ADDRESSES } from 'config/web3/contracts/uniswap-v2-factory';
import { Address } from 'types/interfaces';

const getPairAddress = (
  tokenA: Address,
  tokenB: Address,
  chainID: number
): string => {
  const [token0, token1] = tokenA < tokenB ? [tokenA, tokenB] : [tokenB, tokenA];
  const salt = keccak256(pack(['address', 'address'], [token0, token1]));

  const uniswapV2FactoryAddress = UNISWAP_V2_FACTORY_ADDRESSES[chainID];
  return getCreate2Address(
    uniswapV2FactoryAddress,
    salt,
    // TODO: hardcoded
    '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f'
  );
};

export default getPairAddress;
