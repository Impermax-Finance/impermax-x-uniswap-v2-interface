
import * as React from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient
} from 'react-query';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { BigNumber } from '@ethersproject/bignumber';
import {
  Contract,
  ContractTransaction,
  ContractReceipt
} from '@ethersproject/contracts';
import clsx from 'clsx';

import SubmitButton from '../SubmitButton';
import WalletConnectButton from 'containers/WalletConnectButton';
import ErrorFallback from 'components/ErrorFallback';
import ErrorModal from 'components/ErrorModal';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import StakingRewardsJSON from 'abis/contracts/StakingRewards.json';
import { useTransactionAdder } from 'store/transactions/hooks';
import { STAKING_REWARD_ADDRESSES, USDC_CLAIMABLE_DECIMALS } from '../../../../config/web3/contracts/usdc-distributor';
import { STAKING_USER_DATA_FETCHER } from '../../../../services/fetchers/staking-user-data-fetcher';
import { useForm } from 'react-hook-form';
import formatNumberWithFixedDecimals from '../../../../utils/helpers/format-number-with-fixed-decimals';
import { formatUnits } from '@ethersproject/units';
import ImpermaxImage from '../../../../components/UI/ImpermaxImage';
import usdcLogo from 'assets/images/icons/usdc.png';

const getStakingRewardsContract = (chainID: number, library: Web3Provider, account: string) => {
  const stakingRewardsAddress = STAKING_REWARD_ADDRESSES[chainID];
  const signer = library.getSigner(account);

  return new Contract(stakingRewardsAddress, StakingRewardsJSON.abi, signer);
};

const ClaimForm = (props: React.ComponentPropsWithRef<'form'>): JSX.Element => {
  const {
    chainId,
    account,
    library,
    active
  } = useWeb3React<Web3Provider>();

  const { handleSubmit } = useForm<Record<string, never>>({});

  const stakingRewardAddress = chainId ? STAKING_REWARD_ADDRESSES[chainId] : undefined;
  const {
    isIdle: usdcEarnedIdle,
    isLoading: usdcEarnedLoading,
    isSuccess: usdcEarnedSuccess,
    data: usdcEarned,
    error: usdcEarnedError,
    refetch: usdcEarnedRefetch
  } = useQuery<BigNumber, Error>(
    [
      GENERIC_FETCHER,
      chainId,
      stakingRewardAddress,
      'earned',
      account
    ],
    (chainId && library && account) ?
      genericFetcher<BigNumber>(library, StakingRewardsJSON.abi) :
      Promise.resolve,
    {
      enabled: !!(chainId && library && account)
    }
  );
  useErrorHandler(usdcEarnedError);

  const queryClient = useQueryClient();
  const claimMutation = useMutation<ContractReceipt, Error, void>(
    async () => {
      if (!chainId) {
        throw new Error('Invalid chain ID!');
      }
      if (!library) {
        throw new Error('Invalid library!');
      }
      if (!account) {
        throw new Error('Invalid account!');
      }

      const stakingRewardsContract = getStakingRewardsContract(chainId, library, account);
      const tx: ContractTransaction = await stakingRewardsContract.getReward();
      return await tx.wait();
    },
    {
      onSuccess: data => {
        addTransaction({
          hash: data.transactionHash
        }, {
          summary: `Claim USDC.`
        });
        usdcEarnedRefetch();
        // Invalidations for Earned
        queryClient.invalidateQueries([
          STAKING_USER_DATA_FETCHER,
          chainId,
          account
        ]);
      }
    }
  );

  const addTransaction = useTransactionAdder();

  const onClaim = async () => {
    claimMutation.mutate();
  };

  let floatUSDCEarned = 0;
  let submitButtonText = 'Claim';
  if (usdcEarnedSuccess) {
    if (usdcEarned === undefined) {
      throw new Error('Invalid USDC earned!');
    }

    submitButtonText = 'Claim';
    floatUSDCEarned = formatNumberWithFixedDecimals(2)(parseFloat(formatUnits(usdcEarned, USDC_CLAIMABLE_DECIMALS)));
  }
  if (usdcEarnedIdle || usdcEarnedLoading) {
    submitButtonText = 'Loading...';
  }

  return (
    <>
      <form
        onSubmit={
          (usdcEarnedSuccess) ?
            handleSubmit(onClaim) :
            undefined
        }
        {...props}>
        <dl
          className={clsx(
            'ml-3'
          )}>
          <dt>
            Pending Balance:
          </dt>
          <dd
            className={clsx(
              'text-lg'
            )}>
            <ImpermaxImage
              width={24}
              height={24}
              className={clsx(
                'inline-block',
                'mr-1',
                'mb-1',
                'rounded-full'
              )}
              src={usdcLogo} />
            <b>{floatUSDCEarned}</b> USDC
          </dd>
        </dl>
        {active ? (
          <SubmitButton
            disabled={usdcEarnedIdle || usdcEarnedLoading}
            pending={claimMutation.isLoading}>
            {submitButtonText}
          </SubmitButton>
        ) : (
          <WalletConnectButton
            style={{
              height: 56
            }}
            className={clsx(
              'w-full',
              'text-lg'
            )} />
        )}
      </form>
      {(claimMutation.isError) && (
        <ErrorModal
          open={claimMutation.isError}
          onClose={() => {
            if (claimMutation.isError) {
              claimMutation.reset();
            }
          }}
          title='Error'
          description={
            claimMutation.error?.message || ''
          } />
      )}
    </>
  );
};

export default withErrorBoundary(ClaimForm, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
