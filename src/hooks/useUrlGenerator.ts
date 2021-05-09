// ray test touch <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// ray test touch >

import { useWETH, useChainId } from './useNetwork';
import usePairAddress from './usePairAddress';
import { PoolTokenType } from '../impermax-router/interfaces';
import { useUnderlyingAddress } from './useData';
import Web3 from 'web3';
import { useWallet } from 'use-wallet';

export function useLendingPoolUrl() : string {
  const uniswapV2PairAddress = usePairAddress();
  return '/lending-pool/' + uniswapV2PairAddress;
}

export function useThisAccountUrl() : string {
  const { account } = useWallet();
  if (!account) return null;
  return '/account/' + account;
}

export function useTokenIcon(poolTokenTypeArg?: PoolTokenType) : string {
  const tokenAddress = useUnderlyingAddress(poolTokenTypeArg);
  if (!tokenAddress) return '';
  const convertedAddress = Web3.utils.toChecksumAddress(tokenAddress);
  try {
    return `/assets/icons/${convertedAddress}.png`;
  } catch {
    // ray test touch <
    // TODO: not working
    return '/assets/default.png';
    // ray test touch >
  }
}

export function useAddLiquidityUrl() : string {
  const WETH = useWETH();
  const tokenAAddress = useUnderlyingAddress(PoolTokenType.BorrowableA);
  const tokenBAddress = useUnderlyingAddress(PoolTokenType.BorrowableB);
  // eslint-disable-next-line eqeqeq
  const addressA = tokenAAddress == WETH ? 'ETH' : tokenAAddress;
  // eslint-disable-next-line eqeqeq
  const addressB = tokenBAddress == WETH ? 'ETH' : tokenBAddress;
  return 'https://app.uniswap.org/#/add/' + addressA + '/' + addressB;
}

export function useTransactionUrlGenerator() : (hash: string) => string {
  const chainId = useChainId();
  // eslint-disable-next-line eqeqeq
  const subdomain = chainId == 3 ? 'ropsten.' : '';
  return (hash: string) => 'https://' + subdomain + 'etherscan.io/tx/' + hash;
}

export function useTransactionUrl(hash: string) : string {
  const generator = useTransactionUrlGenerator();
  return generator(hash);
}
