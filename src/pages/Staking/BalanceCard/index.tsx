
import clsx from 'clsx';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { formatUnits } from '@ethersproject/units';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { useQuery } from 'react-query';

import Panel, { Props as PanelProps } from 'components/Panel';
import ErrorFallback from 'components/ErrorFallback';
import ImpermaxPicture from 'components/UI/ImpermaxPicture';
import {
  X_IMX_ADDRESSES,
  X_IMX_DECIMALS
} from 'config/web3/contracts/x-imxes';
import {
  IMX_ADDRESSES,
  IMX_DECIMALS
} from 'config/web3/contracts/imxes';
import useTokenBalance from 'utils/hooks/web3/use-token-balance';
import formatNumberWithFixedDecimals from 'utils/helpers/format-number-with-fixed-decimals';
import formatNumberWithComma from 'utils/helpers/web3/format-number-with-comma';
import xIMXDataFetcher, {
  XIMXData,
  X_IMX_DATA_FETCHER
} from 'services/fetchers/x-imx-data-fetcher';
import stakingUserDataFetcher, {
  StakingUserData,
  STAKING_USER_DATA_FETCHER
} from 'services/fetchers/staking-user-data-fetcher';

interface BalanceItemProps {
  label: string;
  value: string;
  unitName: string;
}

const BalanceItem = ({
  label,
  value,
  unitName
}: BalanceItemProps) => (
  <div className='space-y-3'>
    <h4
      className={clsx(
        'text-xl',
        'font-medium',
        'text-textSecondary'
      )}>
      {label}
    </h4>
    <div
      className={clsx(
        'flex',
        'items-center',
        'space-x-4'
      )}>
      <ImpermaxPicture
        images={[
          {
            type: 'image/avif',
            path: 'assets/images/ximx-logos/ximx-logo.avif'
          },
          {
            type: 'image/webp',
            path: 'assets/images/ximx-logos/ximx-logo.webp'
          },
          {
            type: 'image/png',
            path: 'assets/images/ximx-logos/ximx-logo.png'
          }
        ]}
        width={36}
        height={36}
        alt='IMX' />
      <div
        className={clsx(
          'inline-flex',
          'flex-col',
          'space-y-1'
        )}>
        <span
          className={clsx(
            'font-medium',
            'text-xl'
          )}>
          {value}
        </span>
        <span className='font-medium'>{unitName}</span>
      </div>
    </div>
  </div>
);

const BalanceCard = ({
  className,
  ...rest
}: PanelProps): JSX.Element => {
  const {
    chainId,
    library,
    account,
    active
  } = useWeb3React<Web3Provider>();

  const imxTokenAddress = chainId ? IMX_ADDRESSES[chainId] : undefined;
  const {
    isLoading: imxBalanceLoading,
    data: imxBalance,
    error: imxBalanceError
  } = useTokenBalance(
    chainId,
    library,
    imxTokenAddress,
    account
  );
  useErrorHandler(imxBalanceError);

  const xIMXTokenAddress = chainId ? X_IMX_ADDRESSES[chainId] : undefined;
  const {
    isLoading: xIMXBalanceLoading,
    data: xIMXBalance,
    error: xIMXBalanceError
  } = useTokenBalance(
    chainId,
    library,
    xIMXTokenAddress,
    account
  );
  useErrorHandler(xIMXBalanceError);

  const {
    isLoading: xIMXDataLoading,
    data: xIMXData,
    error: xIMXDataError
  } = useQuery<XIMXData, Error>(
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
    isLoading: stakingUserDataLoading,
    data: stakingUserData,
    error: stakingUserDataError
  } = useQuery<StakingUserData, Error>(
    [
      STAKING_USER_DATA_FETCHER,
      chainId,
      account
    ],
    stakingUserDataFetcher,
    {
      enabled: chainId !== undefined && account !== undefined
    }
  );
  useErrorHandler(stakingUserDataError);

  let stakedBalanceLabel;
  let unstakedBalanceLabel;
  let earnedLabel;
  if (active) {
    if (xIMXBalanceLoading || xIMXDataLoading) {
      stakedBalanceLabel = 'Loading...';
    } else {
      if (xIMXBalance === undefined) {
        throw new Error('Something went wrong!');
      }
      if (xIMXData === undefined) {
        throw new Error('Something went wrong!');
      }

      const xIMXRate = parseFloat(xIMXData.exchangeRate);
      const floatXIMXBalance = parseFloat(formatUnits(xIMXBalance, X_IMX_DECIMALS));
      stakedBalanceLabel = formatNumberWithFixedDecimals(floatXIMXBalance * xIMXRate, 2);
      stakedBalanceLabel = formatNumberWithComma(stakedBalanceLabel);
    }

    if (imxBalanceLoading) {
      unstakedBalanceLabel = 'Loading...';
    } else {
      if (imxBalance === undefined) {
        throw new Error('Something went wrong!');
      }

      unstakedBalanceLabel = parseFloat(formatUnits(imxBalance, IMX_DECIMALS));
      unstakedBalanceLabel = formatNumberWithFixedDecimals(unstakedBalanceLabel, 2);
      unstakedBalanceLabel = formatNumberWithComma(unstakedBalanceLabel);
    }

    if (stakingUserDataLoading || xIMXDataLoading) {
      earnedLabel = 'Loading...';
    } else {
      if (stakingUserData === undefined) {
        throw new Error('Something went wrong!');
      }
      if (xIMXData === undefined) {
        throw new Error('Something went wrong!');
      }

      const xIMXRate = parseFloat(xIMXData.exchangeRate);
      const totalEarned = parseFloat(stakingUserData.totalEarned);
      const anotherXIMXBalance = parseFloat(stakingUserData.ximxBalance);
      const lastExchangeRate = parseFloat(stakingUserData.lastExchangeRate);
      earnedLabel = totalEarned + anotherXIMXBalance * (xIMXRate - lastExchangeRate);
      earnedLabel = formatNumberWithFixedDecimals(earnedLabel, 2);
      earnedLabel = formatNumberWithComma(earnedLabel);
    }
  } else {
    stakedBalanceLabel = '-';
    unstakedBalanceLabel = '-';
    earnedLabel = '-';
  }

  return (
    <Panel
      className={clsx(
        'px-8',
        'py-7',
        'space-y-4',
        'bg-white',
        className
      )}
      {...rest}>
      <BalanceItem
        label='Staked Balance'
        value={stakedBalanceLabel}
        unitName='IMX' />
      <BalanceItem
        label='Unstaked Balance'
        value={unstakedBalanceLabel}
        unitName='IMX' />
      <BalanceItem
        label='Earned'
        value={earnedLabel}
        unitName='IMX' />
    </Panel>
  );
};

export default withErrorBoundary(BalanceCard, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
