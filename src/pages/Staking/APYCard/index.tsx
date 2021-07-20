
import * as React from 'react';
import { usePromise } from 'react-use';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import clsx from 'clsx';
// TODO: not used for now
// import { formatUnits } from '@ethersproject/units';
// import { Contract } from '@ethersproject/contracts';

import Panel from 'components/Panel';
import ErrorFallback from 'components/ErrorFallback';
import formatNumberWithFixedDecimals from 'utils/helpers/format-number-with-fixed-decimals';
import STATUSES from 'utils/constants/statuses';
import getXIMXData from 'services/get-x-imx-data';
// TODO: not used for now
// import { IMX_ADDRESSES } from 'config/web3/contracts/imxes';
// import { X_IMX_ADDRESSES } from 'config/web3/contracts/x-imxes';
// import { RESERVES_DISTRIBUTOR_ADDRESSES } from 'config/web3/contracts/reserves-distributors';
// import ReservesDistributorJSON from 'abis/contracts/IReservesDistributor.json';
// import getERC20Contract from 'utils/helpers/web3/get-erc20-contract';

// TODO: not used for now
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
}: React.ComponentPropsWithRef<'div'>): JSX.Element => {
  const {
    chainId,
    active
  } = useWeb3React<Web3Provider>();

  const handleError = useErrorHandler();
  const mounted = usePromise();

  const [status, setStatus] = React.useState(STATUSES.IDLE);
  const [xIMXAPY, setXIMXAPY] = React.useState(0);

  React.useEffect(() => {
    if (!chainId) return;
    if (!mounted) return;
    if (!handleError) return;

    (async () => {
      try {
        setStatus(STATUSES.PENDING);
        const xIMXData = await mounted(getXIMXData(chainId));
        const theXIMXAPY = Math.pow(1 + parseFloat(xIMXData.dailyAPR), 365) - 1;
        setXIMXAPY(theXIMXAPY);
        setStatus(STATUSES.RESOLVED);
      } catch (error) {
        setStatus(STATUSES.REJECTED);
        handleError(error);
      }
    })();
  }, [
    chainId,
    mounted,
    handleError
  ]);

  const xIMXAPYInPercent = formatNumberWithFixedDecimals(xIMXAPY * 100, 2);
  let apyLabel;
  if (active) {
    apyLabel =
      (status === STATUSES.IDLE || status === STATUSES.PENDING) ?
        'Loading...' :
        `${xIMXAPYInPercent} %`;
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
