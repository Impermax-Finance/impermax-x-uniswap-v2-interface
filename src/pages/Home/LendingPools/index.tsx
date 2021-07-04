
import * as React from 'react';
import { usePromise } from 'react-use';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import gql from 'graphql-tag';
import clsx from 'clsx';
import { useMedia } from 'react-use';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';

import LendingPool from './LendingPool';
import LendingPoolsHeader from './LendingPoolsHeader';
import ErrorFallback from 'components/ErrorFallback';
import getUniswapAPYs from 'services/get-uniswap-apys';
import {
  Address,
  LendingPoolData
} from 'types/interfaces';
import apolloFetcher from 'services/apollo-fetcher';
import { IMPERMAX_SUBGRAPH_URL } from 'config/web3/subgraph';
import { BREAKPOINTS } from 'utils/constants/styles';
import { ReactComponent as SpinIcon } from 'assets/images/icons/spin.svg';
import STATUSES from 'utils/constants/statuses';

const borrowableStr = `{
  id
  underlying {
    id
    symbol
    name
    decimals
    derivedUSD
  }
  totalBalance
  totalBorrows
  borrowRate
  reserveFactor
  kinkBorrowRate
  kinkUtilizationRate
  borrowIndex
  accrualTimestamp 
  exchangeRate 
  totalBalanceUSD
  totalSupplyUSD
  totalBorrowsUSD
  farmingPool {
    epochAmount
    epochBegin
    segmentLength
    vestingBegin
    sharePercentage
    distributor {
      id
    }
  }
}`;

const query = gql`{
  lendingPools(first: 1000, orderBy: totalBorrowsUSD, orderDirection: desc) {
    id
    borrowable0 ${borrowableStr}
    borrowable1 ${borrowableStr}
    collateral {
      id
      totalBalance
      totalBalanceUSD
      safetyMargin
      liquidationIncentive
      exchangeRate 
    }
    pair {
      reserve0
      reserve1
      reserveUSD
      token0Price
      token1Price
      derivedUSD
    }
  }
}`;

const LendingPools = (): JSX.Element | null => {
  const { chainId } = useWeb3React<Web3Provider>();

  const greaterThanMd = useMedia(`(min-width: ${BREAKPOINTS.md})`);

  const [lendingPoolsData, setLendingPoolsData] = React.useState<{ [key in Address]: LendingPoolData }>();
  const [lendingPools, setLendingPools] = React.useState<Array<LendingPoolData>>();
  const [status, setStatus] = React.useState(STATUSES.IDLE);

  const handleError = useErrorHandler();

  const mounted = usePromise();

  React.useEffect(() => {
    if (!chainId) return;
    if (!handleError) return;
    if (!mounted) return;
    /**
     * TODO:
     * - https://stackoverflow.com/questions/53949393/cant-perform-a-react-state-update-on-an-unmounted-component
     * - https://github.com/streamich/react-use/blob/master/src/useAsyncFn.ts
     */
    (async () => {
      try {
        setStatus(STATUSES.PENDING);
        const impermaxSubgraphUrl = IMPERMAX_SUBGRAPH_URL[chainId];
        const result = await mounted(apolloFetcher(impermaxSubgraphUrl, query));
        const theLendingPools = result.data.lendingPools;
        setLendingPools(theLendingPools);

        // TODO: should type properly
        const uniswapV2PairAddresses = theLendingPools.map((theLendingPool: { id: any; }) => theLendingPool.id);
        const uniswapAPYs = await mounted(getUniswapAPYs(uniswapV2PairAddresses));

        const theLendingPoolsData: { [key in Address]: LendingPoolData } = {};
        for (const theLendingPool of theLendingPools) {
          theLendingPoolsData[theLendingPool.id] = theLendingPool;
          theLendingPoolsData[theLendingPool.id].pair.uniswapAPY = uniswapAPYs[theLendingPool.id];
        }

        setLendingPoolsData(theLendingPoolsData);
        setStatus(STATUSES.RESOLVED);
      } catch (error) {
        setStatus(STATUSES.REJECTED);
        handleError(error);
        console.log('[useLendingPools useEffect] error.message => ', error.message);
      }
    })();
  }, [
    chainId,
    handleError,
    mounted
  ]);

  if (status === STATUSES.IDLE || status === STATUSES.PENDING) {
    return (
      <div
        className={clsx(
          'p-7',
          'flex',
          'justify-center'
        )}>
        <SpinIcon
          className={clsx(
            'animate-spin',
            'w-8',
            'h-8',
            'text-impermaxJade'
          )} />
      </div>
    );
  }

  if (status === STATUSES.RESOLVED) {
    if (!lendingPools) {
      throw new Error('Invalid lendingPools!');
    }
    if (!lendingPoolsData) {
      throw new Error('Invalid lendingPoolsData!');
    }
    if (!chainId) {
      throw new Error('Invalid chain ID!');
    }

    return (
      <div className='space-y-3'>
        {greaterThanMd && (
          <LendingPoolsHeader className='px-4' />
        )}
        {lendingPools.map(lendingPool => {
          return (
            <LendingPool
              key={lendingPool.id}
              chainID={chainId}
              // TODO: could combine `lendingPoolsData` and `lendingPool`
              lendingPoolsData={lendingPoolsData}
              lendingPool={lendingPool}
              greaterThanMd={greaterThanMd} />
          );
        })}
      </div>
    );
  }

  return null;
};

export default withErrorBoundary(LendingPools, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
