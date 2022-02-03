
import * as React from 'react';
import { useForm } from 'react-hook-form';
import {
  useMutation,
  useQueryClient
} from 'react-query';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import {
  formatUnits,
  parseUnits
} from '@ethersproject/units';
import {
  Zero
} from '@ethersproject/constants';
import {
  Contract,
  ContractTransaction,
  ContractReceipt
} from '@ethersproject/contracts';
import clsx from 'clsx';

import TokenAmountLabel from '../TokenAmountLabel';
import TokenAmountField from '../TokenAmountField';
import SubmitButton from '../SubmitButton';
import WalletConnectButton from 'containers/WalletConnectButton';
import ErrorFallback from 'components/ErrorFallback';
import ErrorModal from 'components/ErrorModal';
import {
  X_IMX_DECIMALS
} from 'config/web3/contracts/x-imxes';
import { IMX_ADDRESSES } from 'config/web3/contracts/imxes';
import useTokenBalance from 'services/hooks/use-token-balance';
import formatNumberWithFixedDecimals from 'utils/helpers/format-number-with-fixed-decimals';
import { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import { STAKING_USER_DATA_FETCHER } from 'services/fetchers/staking-user-data-fetcher';
import StakingRewardsJSON from 'abis/contracts/StakingRewards.json';
import { useTransactionAdder } from 'store/transactions/hooks';
import { STAKING_REWARD_ADDRESSES } from '../../../../config/web3/contracts/usdc-distributor';
import { STAKING_REWARDS_DATA_FETCHER } from '../../../../services/fetchers/staking-rewards-data-fetcher';
import { useState } from 'react';

const getStakingRewardsContract = (chainID: number, library: Web3Provider, account: string) => {
  const stakingRewardsAddress = STAKING_REWARD_ADDRESSES[chainID];
  const signer = library.getSigner(account);

  return new Contract(stakingRewardsAddress, StakingRewardsJSON.abi, signer);
};

const UNSTAKING_AMOUNT = 'unstaking-amount';

type UnstakingFormData = {
  [UNSTAKING_AMOUNT]: string;
}

const UnstakingForm = (props: React.ComponentPropsWithRef<'form'>): JSX.Element => {
  const {
    chainId,
    account,
    library,
    active
  } = useWeb3React<Web3Provider>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<UnstakingFormData>({
    mode: 'onChange'
  });

  const stakingRewardAddress = chainId ? STAKING_REWARD_ADDRESSES[chainId] : undefined;
  const {
    isIdle: stakedBalanceIdle,
    isLoading: stakedBalanceLoading,
    isSuccess: stakedBalanceSuccess,
    data: stakedBalance,
    error: stakedBalanceError,
    refetch: stakedBalanceRefetch
  } = useTokenBalance(
    chainId,
    library,
    stakingRewardAddress,
    account
  );
  useErrorHandler(stakedBalanceError);

  const queryClient = useQueryClient();
  const unstakeMutation = useMutation<ContractReceipt, Error, string>(
    async (variables: string) => {
      if (!chainId) {
        throw new Error('Invalid chain ID!');
      }
      if (!library) {
        throw new Error('Invalid library!');
      }
      if (!account) {
        throw new Error('Invalid account!');
      }
      if (stakedBalance === undefined) {
        throw new Error('Invalid staked balance!');
      }

      const bigUnstakingAmount = parseUnits(variables);
      const stakingRewardsContract = getStakingRewardsContract(chainId, library, account);
      const tx: ContractTransaction = floatStakedBalance === parseFloat(variables) ?
        await stakingRewardsContract.exit() :
        await stakingRewardsContract.withdraw(bigUnstakingAmount);
      return await tx.wait();
    },
    {
      onSuccess: (data, variables) => {
        addTransaction({
          hash: data.transactionHash
        }, {
          summary: `Unstake IMX (${variables}).`
        });
        reset({
          [UNSTAKING_AMOUNT]: ''
        });
        // Invalidations for Staked Balance & Unstaked Balance & Earned
        // Invalidations for Staking APY & Total IMX Staked & Total IMX Distributed
        stakedBalanceRefetch();
        // TODO: could be abstracted
        const imxTokenAddress = chainId ? IMX_ADDRESSES[chainId] : undefined;
        queryClient.invalidateQueries([
          GENERIC_FETCHER,
          chainId,
          imxTokenAddress,
          'balanceOf',
          account
        ]);
        queryClient.invalidateQueries([
          STAKING_REWARDS_DATA_FETCHER,
          chainId
        ]);
        queryClient.invalidateQueries([
          STAKING_USER_DATA_FETCHER,
          chainId,
          account
        ]);
      }
    }
  );

  const addTransaction = useTransactionAdder();

  const onUnstake = async (data: UnstakingFormData) => {
    unstakeMutation.mutate(data[UNSTAKING_AMOUNT]);
  };

  const [unstakeEverything, setUnstakeEverything] = useState<boolean>(false);
  const validateForm = (value: string): string | undefined => {
    if (stakedBalance === undefined) {
      throw new Error('Invalid staked balance!');
    }

    const bigUnstakingAmount = parseUnits(value);
    if (bigUnstakingAmount.gt(stakedBalance)) {
      return 'Unstaking amount must be less than your staked balance!';
    }

    if (bigUnstakingAmount.lte(Zero)) {
      return 'Unstaking amount must be greater than zero!';
    }

    setUnstakeEverything(floatStakedBalance === parseFloat(value));

    return undefined;
  };

  let floatStakedBalance: number | undefined;
  let submitButtonText: string | undefined;
  if (stakedBalanceSuccess) {
    if (stakedBalance === undefined) {
      throw new Error('Invalid staked balance!');
    }

    submitButtonText = 'Unstake';
    floatStakedBalance = formatNumberWithFixedDecimals(2)(parseFloat(formatUnits(stakedBalance, X_IMX_DECIMALS)));
  }
  if (stakedBalanceIdle || stakedBalanceLoading) {
    submitButtonText = 'Loading...';
  }

  const inputMaxValue = () => {
    if (!floatStakedBalance) return;

    reset({
      [UNSTAKING_AMOUNT]: floatStakedBalance.toString()
    });
    validateForm(floatStakedBalance.toString());
  };

  return (
    <>
      <form
        onSubmit={
          stakedBalanceSuccess ?
            handleSubmit(onUnstake) :
            undefined
        }
        {...props}>
        <TokenAmountLabel
          htmlFor={UNSTAKING_AMOUNT}
          text='Unstake IMX' />
        <TokenAmountField
          id={UNSTAKING_AMOUNT}
          {...register(UNSTAKING_AMOUNT, {
            required: {
              value: true,
              message: 'This field is required!'
            },
            validate: value => validateForm(value)
          })}
          inputMaxValue={inputMaxValue}
          balance={floatStakedBalance}
          allowance={undefined}
          error={!!errors[UNSTAKING_AMOUNT]}
          helperText={unstakeEverything ?
            '*Your pending reward will be automatically claimed' :
            errors[UNSTAKING_AMOUNT]?.message}
          tokenSymbol='IMX'
          walletActive={active}
          disabled={!stakedBalance} />
        {active ? (
          <SubmitButton
            disabled={stakedBalanceIdle || stakedBalanceLoading}
            pending={unstakeMutation.isLoading}>
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
      {(unstakeMutation.isError) && (
        <ErrorModal
          open={unstakeMutation.isError}
          onClose={() => {
            if (unstakeMutation.isError) {
              unstakeMutation.reset();
            }
          }}
          title='Error'
          description={
            unstakeMutation.error?.message || ''
          } />
      )}
    </>
  );
};

export default withErrorBoundary(UnstakingForm, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
