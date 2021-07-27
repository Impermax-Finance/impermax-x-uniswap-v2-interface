
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import clsx from 'clsx';
import { useQuery } from 'react-query';

import Panel, { Props as PanelProps } from 'components/Panel';
import ErrorFallback from 'components/ErrorFallback';
import formatNumberWithFixedDecimals from 'utils/helpers/format-number-with-fixed-decimals';
import xIMXDataFetcher, {
  XImxData,
  X_IMX_DATA_FETCHER
} from 'services/fetchers/x-imx-data-fetcher';
import reservesDistributorDataFetcher, {
  ReservesDistributorData,
  RESERVES_DISTRIBUTOR_DATA_FETCHER
} from 'services/fetchers/reserves-distributor-data-fetcher';

// TODO: not used for now
// import { formatUnits } from '@ethersproject/units';
// import { Contract } from '@ethersproject/contracts';
// import { IMX_ADDRESSES } from 'config/web3/contracts/imxes';
// import { X_IMX_ADDRESSES } from 'config/web3/contracts/x-imxes';
// import { RESERVES_DISTRIBUTOR_ADDRESSES } from 'config/web3/contracts/reserves-distributors';
// import ReservesDistributorJSON from 'abis/contracts/IReservesDistributor.json';
// import getERC20Contract from 'utils/helpers/web3/get-erc20-contract';
// const getXIMXAPY = async (chainID: number, library: Web3Provider) => {
//   const imxContract = getERC20Contract(IMX_ADDRESSES[chainID], library);
//   const bigReservesDistributorBalance = await imxContract.balanceOf(RESERVES_DISTRIBUTOR_ADDRESSES[chainID]);
//   const reservesDistributorBalance = parseFloat(formatUnits(bigReservesDistributorBalance));
//   const bigXImxBalance = await imxContract.balanceOf(X_IMX_ADDRESSES[chainID]);
//   const xImxBalance = parseFloat(formatUnits(bigXImxBalance));
//   const reservesDistributorContract =
//     new Contract(RESERVES_DISTRIBUTOR_ADDRESSES[chainID], ReservesDistributorJSON.abi, library);
//   const periodLength = await reservesDistributorContract.periodLength();
//   const dailyAPR = reservesDistributorBalance / periodLength * 3600 * 24 / xImxBalance;
//   return Math.pow(1 + dailyAPR, 365) - 1;
// };

const APYCard = ({
  className,
  ...rest
}: PanelProps): JSX.Element => {
  const {
    chainId,
    active
  } = useWeb3React<Web3Provider>();

  const {
    isLoading: xIMXDataLoading,
    data: xIMXData,
    error: xIMXDataError
  } = useQuery<XImxData, Error>(
    [
      X_IMX_DATA_FETCHER,
      chainId
    ],
    xIMXDataFetcher,
    {
      enabled: chainId !== undefined
    }
  );
  useErrorHandler(xIMXDataError);

  const {
    isLoading: reservesDistributorDataLoading,
    data: reservesDistributorData,
    error: reservesDistributorDataError
  } = useQuery<ReservesDistributorData, Error>(
    [
      RESERVES_DISTRIBUTOR_DATA_FETCHER,
      chainId
    ],
    reservesDistributorDataFetcher,
    {
      enabled: chainId !== undefined
    }
  );
  useErrorHandler(reservesDistributorDataError);

  let apyLabel;
  if (active) {
    if (xIMXDataLoading) {
      apyLabel = 'Loading...';
    } else {
      if (xIMXData === undefined) {
        throw new Error('Something went wrong!');
      }

      const xIMXAPY = Math.pow(1 + parseFloat(xIMXData.dailyAPR), 365) - 1;
      const xIMXAPYInPercent = formatNumberWithFixedDecimals(xIMXAPY * 100, 2);
      apyLabel = `${xIMXAPYInPercent} %`;

      // ray test touch <<<
      // Total IMX Staked
      const totalBalance = xIMXData.totalBalance;
      console.log('ray : ***** [Total IMX Staked] totalBalance => ', totalBalance);
      // ray test touch >>>
    }

    // ray test touch <<<
    if (!reservesDistributorDataLoading) {
      if (reservesDistributorData === undefined) {
        throw new Error('Something went wrong!');
      }

      // Total IMX Distributed
      const distributed = reservesDistributorData.distributed;
      console.log('ray : ***** [Total IMX Distributed] distributed => ', distributed);
    }
    // ray test touch >>>
  } else {
    apyLabel = '-';
  }

  return (
    <Panel
      className={clsx(
        'px-6',
        'py-4',
        'flex',
        'justify-between',
        'items-center',
        'bg-impermaxJade-200',
        className
      )}
      {...rest}>
      <div
        className={clsx(
          'text-base',
          'font-medium'
        )}>
        Staking APY
      </div>
      <div
        className={clsx(
          'flex',
          'flex-col',
          'items-end',
          'space-y-1'
        )}>
        <span
          className={clsx(
            'font-bold',
            'text-2xl',
            'text-textPrimary'
          )}>
          {apyLabel}
        </span>
        <span
          className={clsx(
            'text-sm',
            'text-textSecondary',
            'font-medium'
          )}>
          Staking APY
        </span>
      </div>
    </Panel>
  );
};

export default withErrorBoundary(APYCard, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
