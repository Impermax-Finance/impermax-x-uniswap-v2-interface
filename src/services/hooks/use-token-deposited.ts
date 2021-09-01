
import { Web3Provider } from '@ethersproject/providers';
import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';
import { useQuery } from 'react-query';

import { ROUTER_ADDRESSES } from 'config/web3/contracts/routers';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import Router01JSON from 'abis/contracts/IRouter01.json';
import BorrowableJSON from 'abis/contracts/IBorrowable.json';
import UniswapV2PairJSON from 'abis/contracts/IUniswapV2Pair.json';
import ERC20JSON from 'abis/contracts/IERC20.json';
import { PoolTokenType } from 'types/interfaces';

const useTokenDeposited = (
  uniswapV2PairAddress: string,
  poolToken: PoolTokenType.BorrowableA | PoolTokenType.BorrowableB,
  chainID: number,
  library: Web3Provider | undefined,
  account: string | null | undefined
): {
  isLoading: boolean;
  data: number | undefined;
  error: Error | null
} => {
  const routerAddress = ROUTER_ADDRESSES[chainID];
  const {
    isLoading: lendingPoolLoading,
    data: lendingPool,
    error: lendingPoolError
  } = useQuery<any, Error>(
    [
      GENERIC_FETCHER,
      chainID,
      routerAddress,
      'getLendingPool',
      uniswapV2PairAddress
    ],
    library ?
      // TODO: should type properly
      genericFetcher<any>(library, Router01JSON.abi) :
      Promise.resolve,
    {
      enabled: !!library
    }
  );

  const borrowableAddress =
    poolToken === PoolTokenType.BorrowableA ?
      lendingPool?.borrowableA :
      lendingPool?.borrowableB;
  const {
    isLoading: bigTokenBalanceLoading,
    data: bigTokenBalance,
    error: bigTokenBalanceError
  } = useQuery<BigNumber, Error>(
    [
      GENERIC_FETCHER,
      chainID,
      borrowableAddress,
      'balanceOf',
      account
    ],
    (borrowableAddress && library && account) ?
      genericFetcher<BigNumber>(library, BorrowableJSON.abi) :
      Promise.resolve,
    {
      enabled: !!(borrowableAddress && library && account)
    }
  );

  const {
    isLoading: bigTokenExchangeRateLoading,
    data: bigTokenExchangeRate,
    error: bigTokenExchangeRateError
  } = useQuery<BigNumber, Error>(
    [
      GENERIC_FETCHER,
      chainID,
      borrowableAddress,
      'exchangeRate'
    ],
    (borrowableAddress && library) ?
      genericFetcher<BigNumber>(library, BorrowableJSON.abi, true) :
      Promise.resolve,
    {
      enabled: !!(borrowableAddress && library)
    }
  );

  const {
    isLoading: tokenAddressLoading,
    data: tokenAddress,
    error: tokenAddressError
  } = useQuery<string, Error>(
    [
      GENERIC_FETCHER,
      chainID,
      uniswapV2PairAddress,
      poolToken === PoolTokenType.BorrowableA ?
        'token0' :
        'token1'
    ],
    library ?
      genericFetcher<string>(library, UniswapV2PairJSON.abi) :
      Promise.resolve,
    {
      enabled: !!library
    }
  );

  const {
    isLoading: tokenDecimalsLoading,
    data: tokenDecimals,
    error: tokenDecimalsError
  } = useQuery<number, Error>(
    [
      GENERIC_FETCHER,
      chainID,
      tokenAddress,
      'decimals'
    ],
    (tokenAddress && library) ?
      genericFetcher<number>(library, ERC20JSON.abi) :
      Promise.resolve,
    {
      enabled: !!(tokenAddress && library)
    }
  );

  let tokenDepositedInUSD: number | undefined;
  if (bigTokenExchangeRate && bigTokenBalance && tokenDecimals) {
    const tokenExchangeRate = parseFloat(formatUnits(bigTokenExchangeRate));
    const tokenBalance = parseFloat(formatUnits(bigTokenBalance, tokenDecimals));
    tokenDepositedInUSD = tokenBalance * tokenExchangeRate;
  } else {
    tokenDepositedInUSD = undefined;
  }

  return {
    isLoading: (
      lendingPoolLoading ||
      bigTokenExchangeRateLoading ||
      bigTokenBalanceLoading ||
      tokenAddressLoading ||
      tokenDecimalsLoading
    ),
    data: tokenDepositedInUSD,
    error: (
      lendingPoolError ??
      bigTokenBalanceError ??
      bigTokenExchangeRateError ??
      tokenAddressError ??
      tokenDecimalsError
    )
  };
};

export default useTokenDeposited;
