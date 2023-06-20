
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import clsx from 'clsx';
import ErrorFallback from '../../../components/ErrorFallback';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import xIMXDataFetcher, { X_IMX_DATA_FETCHER, XIMXData } from '../../../services/fetchers/x-imx-data-fetcher';
import formatNumberWithFixedDecimals from '../../../utils/helpers/format-number-with-fixed-decimals';
import formatNumberWithComma from '../../../utils/helpers/format-number-with-comma';
import { useQuery } from 'react-query';
import useTokenBalance from '../../../services/hooks/use-token-balance';
import { X_IMX_ADDRESSES, X_IMX_DECIMALS } from '../../../config/web3/contracts/x-imxes';
import { formatUnits } from 'ethers/lib/utils';
import { SUPPORTED_CHAIN_IDS } from '../../../config/web3/chains';
import VaultModalIMXxIMX from '../VaultModalIMXxIMX';
import { default as React, useState } from 'react';
import ImpermaxImage from '../../../components/UI/ImpermaxImage';
import ximxVaultLogo from '../../../assets/images/icons/xibex-vault.png';

const Cell = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'li'>) => (
  <li
    className={clsx(
      'text-lg',
      className
    )}
    {...rest} />
);

const Term = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>) => (
  <div
    className={clsx(
      'font-bold',
      className
    )}
    {...rest} />
);

const Description = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>) => (
  <div
    className={clsx(
      'font-medium',
      className
    )}
    {...rest} />
);

const VaultCardIMXxIMX = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'ul'>): JSX.Element => {
  const [showModal, toggleModal] = useState(false);

  const {
    chainId = SUPPORTED_CHAIN_IDS[0],
    library,
    account,
    active
  } = useWeb3React<Web3Provider>();

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
      enabled: chainId !== undefined,
      refetchInterval: 10000
    }
  );
  useErrorHandler(xIMXDataError);

  let stakingAPYLabel: string | number = '-';
  let totalIMXStakedLabel: string | number = '-';
  if (xIMXDataLoading) {
    stakingAPYLabel = 'Loading...';
    totalIMXStakedLabel = 'Loading...';
  } else {
    if (xIMXData === undefined) {
      throw new Error('Something went wrong!');
    }

    const xIMXAPY = Math.pow(1 + parseFloat(xIMXData.dailyAPR), 365) - 1;
    stakingAPYLabel = formatNumberWithFixedDecimals(2)(xIMXAPY * 100);
    stakingAPYLabel = formatNumberWithComma(stakingAPYLabel);
    stakingAPYLabel = `${stakingAPYLabel}%`;

    totalIMXStakedLabel = formatNumberWithFixedDecimals(2)(Number(xIMXData.totalBalance));
    totalIMXStakedLabel = formatNumberWithComma(totalIMXStakedLabel);
  }

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

  let stakedBalanceLabel;
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
      stakedBalanceLabel = formatNumberWithFixedDecimals(2)(floatXIMXBalance * xIMXRate);
      stakedBalanceLabel = formatNumberWithComma(stakedBalanceLabel);
    }
  } else {
    stakedBalanceLabel = '-';
  }
  return (
    <>
      <ul
        className={clsx(
          'shadow',
          'overflow-hidden',
          'md:rounded',
          'px-4',
          'py-8',
          'bg-white',
          'flex',
          'cursor-pointer',
          className
        )}
        onClick={() => toggleModal(true)}
        {...rest}>
        <Cell
          className={clsx(
            'col-4',
            'flex',
            'items-center'
          )}>
          <ImpermaxImage
            width={40}
            height={40}
            className={clsx(
              'inline-block',
              'mr-2',
              'rounded-full'
            )}
            src={ximxVaultLogo} />
          <span
            className={clsx(
              'inline-block',
              'text-xl'
            )}>
            Stake IBEX, Earn IBEX
          </span>
        </Cell>
        <Cell
          className={clsx(
            'col-3'
          )}>
          <Term>Total Staked</Term>
          <Description>{totalIMXStakedLabel} IBEX</Description>
        </Cell>
        <Cell
          className={clsx(
            'col-3'
          )}>
          <Term>Staked Balance</Term>
          <Description>{stakedBalanceLabel} IBEX</Description>
        </Cell>
        <Cell
          className={clsx(
            'col-2'
          )}>
          <Term>APY</Term>
          <Description>{stakingAPYLabel}</Description>
        </Cell>
      </ul>
      <VaultModalIMXxIMX
        show={showModal}
        toggleShow={toggleModal} />
    </>
  );
};

export default withErrorBoundary(VaultCardIMXxIMX, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
