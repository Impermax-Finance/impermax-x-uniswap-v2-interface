// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { getAddress } from '@ethersproject/address';

import { WETH_ADDRESSES } from 'config/web3/contracts/weth';
import { PoolTokenType } from '../impermax-router/interfaces';
import { useUnderlyingAddress } from './useData';

// ray test touch <<
export function useTokenIcon(poolTokenTypeArg?: PoolTokenType) : string {
  const tokenAddress = useUnderlyingAddress(poolTokenTypeArg);
  if (!tokenAddress) return '';
  const convertedAddress = getAddress(tokenAddress);
  try {
    return `/assets/icons/${convertedAddress}.png`;
  } catch {
    // TODO: <
    // TODO: not working
    return '/assets/default.png';
    // TODO: >
  }
}
// ray test touch >>

export function useAddLiquidityUrl() : string {
  const { chainId } = useWeb3React<Web3Provider>();
  const wethAddress = WETH_ADDRESSES[chainId];
  const tokenAAddress = useUnderlyingAddress(PoolTokenType.BorrowableA);
  const tokenBAddress = useUnderlyingAddress(PoolTokenType.BorrowableB);
  const addressA = tokenAAddress === wethAddress ? 'ETH' : tokenAAddress;
  const addressB = tokenBAddress === wethAddress ? 'ETH' : tokenBAddress;
  return 'https://app.uniswap.org/#/add/' + addressA + '/' + addressB;
}

export function useTransactionUrlGenerator() : (hash: string) => string {
  const { chainId } = useWeb3React<Web3Provider>();
  const subdomain = chainId === 3 ? 'ropsten.' : '';
  return (hash: string) => 'https://' + subdomain + 'etherscan.io/tx/' + hash;
}

export function useTransactionUrl(hash: string) : string {
  const generator = useTransactionUrlGenerator();
  return generator(hash);
}
