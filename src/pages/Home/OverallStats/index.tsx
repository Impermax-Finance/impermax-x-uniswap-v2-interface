
import * as React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';

import OverallStatsInternal from 'components/OverallStatsInternal';
import ErrorFallback from 'components/ErrorFallback';
import getTVLData from 'services/get-tvl-data';
import { TvlData } from 'types/interfaces';

const OverallStats = (): JSX.Element => {
  const { chainId } = useWeb3React<Web3Provider>();

  const [tvlData, setTVLData] = React.useState<TvlData>();
  const handleError = useErrorHandler();

  React.useEffect(() => {
    if (!chainId) return;
    if (!handleError) return;

    // TODO: should add loading UX
    (async () => {
      try {
        const theTVLData = await getTVLData(chainId);
        setTVLData(theTVLData);
      } catch (error) {
        handleError(error);
      }
    })();
  }, [
    chainId,
    handleError
  ]);

  const totalValueLocked = parseFloat(tvlData?.totalBalanceUSD ?? '0');
  const totalValueSupplied = parseFloat(tvlData?.totalSupplyUSD ?? '0');
  const totalValueBorrowed = parseFloat(tvlData?.totalBorrowsUSD ?? '0');

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
