
// ray test touch <<<
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
// ray test touch >>>
import clsx from 'clsx';

import DetailList, { DetailListItem } from 'components/DetailList';
// ray test touch <<<
import ErrorFallback from 'components/ErrorFallback';
import { ROUTER_ADDRESSES } from 'config/web3/contracts/routers';
// ray test touch >>>
import {
  useSuppliedUSD,
  useAccountAPY
} from 'hooks/useData';
import {
  formatNumberWithUSDCommaDecimals,
  formatNumberWithPercentageCommaDecimals
} from 'utils/helpers/format-number';
// ray test touch <<<
import { PARAMETERS } from 'utils/constants/links';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import Router01JSON from 'abis/contracts/IRouter01.json';
import BorrowableJSON from 'abis/contracts/IBorrowable.json';
import UniswapV2PairJSON from 'abis/contracts/IUniswapV2Pair.json';
import ERC20JSON from 'abis/contracts/IERC20.json';
// ray test touch >>>

/**
 * Generates lending pool aggregate details.
 */

const AccountLendingPoolDetailsEarnInterest = (): JSX.Element => {
  // ray test touch <<<
  const {
    [PARAMETERS.CHAIN_ID]: selectedChainIDParam,
    [PARAMETERS.UNISWAP_V2_PAIR_ADDRESS]: selectedUniswapV2PairAddress
  } = useParams<Record<string, string>>();
  const selectedChainID = Number(selectedChainIDParam);

  const {
    library,
    account
  } = useWeb3React<Web3Provider>();

  const routerAddress = ROUTER_ADDRESSES[selectedChainID];
  const {
    isLoading: lendingPoolLoading,
    data: lendingPool,
    error: lendingPoolError
  } = useQuery<any, Error>(
    [
      GENERIC_FETCHER,
      selectedChainID,
      routerAddress,
      'getLendingPool',
      selectedUniswapV2PairAddress
    ],
    library ?
      // TODO: should type properly
      genericFetcher<any>(library, Router01JSON.abi) :
      Promise.resolve,
    {
      enabled: !!library
    }
  );
  useErrorHandler(lendingPoolError);

  const borrowableAAddress = lendingPool?.borrowableA;
  const {
    isLoading: bigTokenABalanceLoading,
    data: bigTokenABalance,
    error: bigTokenABalanceError
  } = useQuery<BigNumber, Error>(
    [
      GENERIC_FETCHER,
      selectedChainID,
      borrowableAAddress,
      'balanceOf',
      account
    ],
    (borrowableAAddress && library && account) ?
      genericFetcher<BigNumber>(library, BorrowableJSON.abi) :
      Promise.resolve,
    {
      enabled: !!(borrowableAAddress && library && account)
    }
  );
  useErrorHandler(bigTokenABalanceError);

  const {
    isLoading: bigTokenAExchangeRateLoading,
    data: bigTokenAExchangeRate,
    error: bigTokenAExchangeRateError
  } = useQuery<BigNumber, Error>(
    [
      GENERIC_FETCHER,
      selectedChainID,
      borrowableAAddress,
      'exchangeRate'
    ],
    (borrowableAAddress && library) ?
      genericFetcher<BigNumber>(library, BorrowableJSON.abi, true) :
      Promise.resolve,
    {
      enabled: !!(borrowableAAddress && library)
    }
  );
  useErrorHandler(bigTokenAExchangeRateError);

  const {
    isLoading: tokenAAddressLoading,
    data: tokenAAddress,
    error: tokenAAddressError
  } = useQuery<string, Error>(
    [
      GENERIC_FETCHER,
      selectedChainID,
      selectedUniswapV2PairAddress,
      'token0'
    ],
    library ?
      genericFetcher<string>(library, UniswapV2PairJSON.abi) :
      Promise.resolve,
    {
      enabled: !!library
    }
  );
  useErrorHandler(tokenAAddressError);

  const {
    isLoading: tokenADecimalsLoading,
    data: tokenADecimals,
    error: tokenADecimalsError
  } = useQuery<number, Error>(
    [
      GENERIC_FETCHER,
      selectedChainID,
      tokenAAddress,
      'decimals'
    ],
    (tokenAAddress && library) ?
      genericFetcher<number>(library, ERC20JSON.abi) :
      Promise.resolve,
    {
      enabled: !!(tokenAAddress && library)
    }
  );
  useErrorHandler(tokenADecimalsError);

  const suppliedUSD = useSuppliedUSD();
  // ray test touch >>>
  // ray test touch <<
  const accountAPY = useAccountAPY();
  // ray test touch >>

  // ray test touch <<<
  // TODO: should use skeleton loaders
  if (lendingPoolLoading) {
    return <>Loading...</>;
  }
  if (bigTokenAExchangeRateLoading) {
    return <>Loading...</>;
  }
  if (bigTokenABalanceLoading) {
    return <>Loading...</>;
  }
  if (tokenAAddressLoading) {
    return <>Loading...</>;
  }
  if (tokenADecimalsLoading) {
    return <>Loading...</>;
  }
  if (lendingPool === undefined) {
    throw new Error('Something went wrong!');
  }
  if (bigTokenAExchangeRate === undefined) {
    throw new Error('Something went wrong!');
  }
  if (bigTokenABalance === undefined) {
    throw new Error('Something went wrong!');
  }

  const tokenAExchangeRate = parseFloat(formatUnits(bigTokenAExchangeRate));
  const tokenABalance = parseFloat(formatUnits(bigTokenABalance, tokenADecimals));
  const tokenADepositedInUSD = tokenABalance * tokenAExchangeRate;
  console.log('ray : ***** tokenABalance => ', tokenABalance);
  console.log('ray : ***** exchangeRate => ', tokenAExchangeRate);
  console.log('ray : ***** tokenAAddress => ', tokenAAddress);
  console.log('ray : ***** tokenADecimals => ', tokenADecimals);
  console.log('ray : ***** tokenADepositedInUSD => ', tokenADepositedInUSD);
  // ray test touch >>>

  return (
    <div
      className={clsx(
        // TODO: componentize
        'space-y-6',
        'md:space-y-0',
        'md:grid',
        'md:grid-cols-2',
        'md:gap-6',
        'px-6',
        'py-6'
      )}>
      <DetailList>
        <DetailListItem title='Supply Balance'>
          {formatNumberWithUSDCommaDecimals(suppliedUSD)}
        </DetailListItem>
      </DetailList>
      <DetailList>
        <DetailListItem title='Net APY'>
          {formatNumberWithPercentageCommaDecimals(accountAPY)}
        </DetailListItem>
      </DetailList>
    </div>
  );
};

// ray test touch <<<
export default withErrorBoundary(AccountLendingPoolDetailsEarnInterest, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
// ray test touch >>>
