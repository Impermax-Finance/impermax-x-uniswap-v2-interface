
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import clsx from 'clsx';
import ErrorFallback from '../../../components/ErrorFallback';
import { CHAIN_IDS } from '../../../config/web3/chains';
import { useWeb3React } from '@web3-react/core';
import { useQuery } from 'react-query';
import formatNumberWithFixedDecimals from '../../../utils/helpers/format-number-with-fixed-decimals';
import formatNumberWithComma from '../../../utils/helpers/format-number-with-comma';
import { Web3Provider } from '@ethersproject/providers';
import stakingRewardsDataFetcher, { STAKING_REWARDS_DATA_FETCHER, StakingRewardsData } from '../../../services/fetchers/staking-rewards-data-fetcher';
import useTokenBalance from '../../../services/hooks/use-token-balance';
import { formatUnits } from 'ethers/lib.esm/utils';
import { IMX_ADDRESSES, IMX_DECIMALS } from '../../../config/web3/contracts/imxes';
import { STAKING_REWARD_ADDRESSES } from '../../../config/web3/contracts/usdc-distributor';
import VaultModalIMXxUSDC from '../VaultModalIMXxUSDC';
import { default as React, useState } from 'react';
import debankPriceFetcher, { DEBANK_PRICE_FETCHER } from '../../../services/fetchers/debank-price-fetcher';
import ImpermaxImage from '../../../components/UI/ImpermaxImage';
import usdcVaultLogo from '../../../assets/images/icons/usdc-vault.png';

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

const VaultCardIMXxUSDC = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'ul'>): JSX.Element => {
  const [showModal, toggleModal] = useState(false);

  const {
    chainId = CHAIN_IDS.ETHEREUM_MAIN_NET,
    library,
    account,
    active
  } = useWeb3React<Web3Provider>();

  const {
    isLoading: stakingRewardsDataLoading,
    data: stakingRewardsData,
    error: stakingRewardsDataError
  } = useQuery<StakingRewardsData, Error>(
    [
      STAKING_REWARDS_DATA_FETCHER,
      chainId
    ],
    stakingRewardsDataFetcher,
    {
      enabled: chainId !== undefined,
      refetchInterval: 10000
    }
  );
  useErrorHandler(stakingRewardsDataError);

  const {
    isLoading: imxPriceLoading,
    data: imxPrice,
    error: imxPriceError
  } = useQuery<number, Error>(
    [
      DEBANK_PRICE_FETCHER,
      chainId,
      IMX_ADDRESSES[chainId]
    ],
    debankPriceFetcher,
    {
      enabled: chainId !== undefined,
      refetchInterval: 10000
    }
  );
  useErrorHandler(imxPriceError);

  let totalIMXStakedLabel: string | number = '-';
  let stakingAPRLabel: string | number = '-';
  if (stakingRewardsDataLoading || imxPriceLoading) {
    totalIMXStakedLabel = 'Loading...';
  } else {
    if (stakingRewardsData === undefined || imxPrice === undefined) {
      throw new Error('Something went wrong!');
    }
    totalIMXStakedLabel = formatNumberWithFixedDecimals(2)(Number(stakingRewardsData.totalBalance));
    totalIMXStakedLabel = formatNumberWithComma(totalIMXStakedLabel);

    const rewardRate = parseFloat(stakingRewardsData.rewardRate);
    const totalBalance = parseFloat(stakingRewardsData.totalBalance);
    const stakingAPR = !imxPrice || !totalBalance ? 0 : rewardRate / (totalBalance * imxPrice) * 365 * 24 * 3600;

    stakingAPRLabel = formatNumberWithFixedDecimals(2)(stakingAPR * 100);
    stakingAPRLabel = formatNumberWithComma(stakingAPRLabel);
    stakingAPRLabel = `${stakingAPRLabel}%`;
  }

  const stakingRewardsAddress = chainId ? STAKING_REWARD_ADDRESSES[chainId] : undefined;
  const {
    isLoading: stakingRewardsBalanceLoading,
    data: stakingRewardsBalance,
    error: stakingRewardsBalanceError
  } = useTokenBalance(
    chainId,
    library,
    stakingRewardsAddress,
    account
  );
  useErrorHandler(stakingRewardsBalanceError);

  let stakedBalanceLabel;
  if (active) {
    if (stakingRewardsBalanceLoading || stakingRewardsBalanceLoading) {
      stakedBalanceLabel = 'Loading...';
    } else {
      if (stakingRewardsBalance === undefined) {
        throw new Error('Something went wrong!');
      }

      const floatXIMXBalance = parseFloat(formatUnits(stakingRewardsBalance, IMX_DECIMALS));
      stakedBalanceLabel = formatNumberWithFixedDecimals(2)(floatXIMXBalance);
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
            src={usdcVaultLogo} />
          <span
            className={clsx(
              'inline-block',
              'text-xl'
            )}>
            Stake IMX, Earn USDC
          </span>
        </Cell>
        <Cell
          className={clsx(
            'col-3'
          )}>
          <Term>Total Staked</Term>
          <Description>{totalIMXStakedLabel} IMX</Description>
        </Cell>
        <Cell
          className={clsx(
            'col-3'
          )}>
          <Term>Staked Balance</Term>
          <Description>{stakedBalanceLabel} IMX</Description>
        </Cell>
        <Cell
          className={clsx(
            'col-2'
          )}>
          <Term>APR</Term>
          <Description>{stakingAPRLabel}</Description>
        </Cell>
      </ul>
      <VaultModalIMXxUSDC
        show={showModal}
        toggleShow={toggleModal} />
    </>
  );
};

export default withErrorBoundary(VaultCardIMXxUSDC, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
