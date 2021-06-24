
import * as React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import gql from 'graphql-tag';
import clsx from 'clsx';
import { useMedia } from 'react-use';

import LendingPool from './LendingPool';
import LendingPoolsHeader from './LendingPoolsHeader';
import PairAddressContext from 'contexts/PairAddress';
import getUniswapAPY from 'services/get-uniswap-apy';
// ray test touch <<
import {
  Address,
  LendingPoolData
} from 'impermax-router/interfaces';
// ray test touch >>
import apolloFetcher from 'services/apollo-fetcher';
import { IMPERMAX_SUBGRAPH_URL } from 'config/web3/subgraph';
import { BREAKPOINTS } from 'utils/constants/styles';
import { ReactComponent as SpinIcon } from 'assets/images/icons/spin.svg';

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

const LendingPools = (): JSX.Element => {
  const { chainId } = useWeb3React<Web3Provider>();

  if (!chainId) {
    throw new Error('Invalid Chain ID!');
  }

  const greaterThanMd = useMedia(`(min-width: ${BREAKPOINTS.md})`);

  const [lendingPoolsData, setLendingPoolsData] = React.useState<{ [key in Address]: LendingPoolData }>();
  // TODO: should type properly
  const [lendingPools, setLendingPools] = React.useState<Array<any>>();

  // TODO: should add abort-controller
  React.useEffect(() => {
    if (!chainId) return;

    (async () => {
      try {
        const impermaxSubgraphUrl = IMPERMAX_SUBGRAPH_URL[chainId];
        const result = await apolloFetcher(impermaxSubgraphUrl, query);
        const theLendingPools = result.data.lendingPools || []; // TODO: should type properly
        setLendingPools(theLendingPools);

        // TODO: should type properly
        const uniswapV2PairAddresses = theLendingPools.map((theLendingPool: { id: any; }) => theLendingPool.id);
        const uniswapAPYs = await getUniswapAPY(uniswapV2PairAddresses);

        const theLendingPoolsData: { [key in Address]: LendingPoolData } = {};
        for (const theLendingPool of theLendingPools) {
          theLendingPoolsData[theLendingPool.id] = theLendingPool;
          theLendingPoolsData[theLendingPool.id].pair.uniswapAPY = uniswapAPYs[theLendingPool.id];
        }

        setLendingPoolsData(theLendingPoolsData);
      } catch (error) {
        // ray test touch <<
        // TODO: should add error handling UX
        // ray test touch >>
        console.log('[useLendingPools useEffect] error.message => ', error.message);
      }
    })();
  }, [chainId]);

  if (!lendingPools || !lendingPoolsData) {
    // ray test touch <<
    // TODO: should add loading UX
    // ray test touch >>
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

  return (
    <div className='space-y-3'>
      {greaterThanMd && (
        <LendingPoolsHeader className='px-4' />
      )}
      {lendingPools.map(lendingPool => {
        return (
          <PairAddressContext.Provider
            value={lendingPool.id}
            key={lendingPool.id}>
            <LendingPool
              chainID={chainId}
              lendingPoolsData={lendingPoolsData}
              lendingPool={lendingPool}
              greaterThanMd={greaterThanMd} />
          </PairAddressContext.Provider>
        );
      })}
    </div>
  );
};

export default LendingPools;
