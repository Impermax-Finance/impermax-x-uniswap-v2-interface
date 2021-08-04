
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { useQuery } from 'react-query';

import OverallStatsInternal from 'components/OverallStatsInternal';
import ErrorFallback from 'components/ErrorFallback';
import tvlDataFetcher, {
  TvlData,
  TVL_DATA_FETCHER
} from 'services/fetchers/tvl-data-fetcher';

const OverallStats = (): JSX.Element => {
  const { chainId } = useWeb3React<Web3Provider>();

  const {
    isLoading: tvlDataLoading,
    data: tvlData,
    error: tvlDataError
  } = useQuery<TvlData, Error>(
    [
      TVL_DATA_FETCHER,
      chainId
    ],
    tvlDataFetcher,
    {
      enabled: chainId !== undefined
    }
  );
  useErrorHandler(tvlDataError);

  // TODO: should use skeleton loaders
  if (tvlDataLoading) {
    return <>Loading...</>;
  }
  if (tvlData === undefined) {
    throw new Error('Something went wrong!');
  }

  const totalValueLocked = parseFloat(tvlData.totalBalanceUSD);
  const totalValueSupplied = parseFloat(tvlData.totalSupplyUSD);
  const totalValueBorrowed = parseFloat(tvlData.totalBorrowsUSD);

  return (
    <OverallStatsInternal
      totalValueLocked={totalValueLocked}
      totalValueSupplied={totalValueSupplied}
      totalValueBorrowed={totalValueBorrowed} />
  );
};

export default withErrorBoundary(OverallStats, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
