// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useWETH } from './useNetwork';
import usePairAddress from './usePairAddress';
import { PoolTokenType } from '../impermax-router/interfaces';
import { useUnderlyingAddress } from './useData';
import { getAddress } from '@ethersproject/address';

export function useLendingPoolUrl() : string {
  const uniswapV2PairAddress = usePairAddress();
  return '/lending-pool/' + uniswapV2PairAddress;
}

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

export function useAddLiquidityUrl() : string {
  const WETH = useWETH();
  const tokenAAddress = useUnderlyingAddress(PoolTokenType.BorrowableA);
  const tokenBAddress = useUnderlyingAddress(PoolTokenType.BorrowableB);
  const addressA = tokenAAddress === WETH ? 'ETH' : tokenAAddress;
  const addressB = tokenBAddress === WETH ? 'ETH' : tokenBAddress;
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
