
// ray test touch <<
import * as React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import gql from 'graphql-tag';

import apolloFetcher from 'services/apollo-fetcher';
import { IMPERMAX_SUBGRAPH_URL } from 'config/web3/subgraph';

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

// TODO: should type properly
// TODO: should add abort-controller
const useLendingPools = () : Array<any> | undefined => {
  const { chainId } = useWeb3React<Web3Provider>();
  const [lendingPools, setLendingPools] = React.useState();

  React.useEffect(() => {
    if (!chainId) return;

    (async () => {
      try {
        const impermaxSubgraphUrl = IMPERMAX_SUBGRAPH_URL[chainId];
        const result = await apolloFetcher(impermaxSubgraphUrl, query);
        const theLendingPools = result.data.lendingPools;
        setLendingPools(theLendingPools);
      } catch (error) {
        console.log('[useLendingPools useEffect] error.message => ', error.message);
      }
    })();
  }, [chainId]);

  return lendingPools;
};

export default useLendingPools;
// ray test touch >>
