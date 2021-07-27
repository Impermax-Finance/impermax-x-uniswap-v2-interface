
import * as React from 'react';
import { useForm } from 'react-hook-form';
import {
  useQuery,
  useMutation
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
  // MaxUint256
} from '@ethersproject/constants';
import { BigNumber } from '@ethersproject/bignumber';
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
import { X_IMX_ADDRESSES } from 'config/web3/contracts/x-imxes';
import { STAKING_ROUTER_ADDRESSES } from 'config/web3/contracts/staking-routers';
import useTokenBalance from 'utils/hooks/web3/use-token-balance';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import ERC20JSON from 'abis/contracts/IERC20.json';
import getERC20Contract from 'utils/helpers/web3/get-erc20-contract';
import formatNumberWithFixedDecimals from 'utils/helpers/format-number-with-fixed-decimals';
import StakingRouterJSON from 'abis/contracts/IStakingRouter.json';
import { useTransactionAdder } from 'store/transactions/hooks';

const getStakingRouterContract = (chainID: number, library: Web3Provider, account: string) => {
  const stakingRouterAddress = STAKING_ROUTER_ADDRESSES[chainID];
  const signer = library.getSigner(account);

  return new Contract(stakingRouterAddress, StakingRouterJSON.abi, signer);
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

  const tokenAddress = chainId ? X_IMX_ADDRESSES[chainId] : undefined;
  const {
    isIdle: xIMXBalanceIdle,
    isLoading: xIMXBalanceLoading,
    isSuccess: xIMXBalanceSuccess,
    data: xIMXBalance,
    error: xIMXBalanceError,
    refetch: xIMXBalanceRefetch
  } = useTokenBalance(
    chainId,
    library,
    tokenAddress,
    account
  );
  useErrorHandler(xIMXBalanceError);

  const owner = account;
  const spender = chainId ? STAKING_ROUTER_ADDRESSES[chainId] : undefined;
  const {
    isIdle: xIMXAllowanceIdle,
    isLoading: xIMXAllowanceLoading,
    isSuccess: xIMXAllowanceSuccess,
    data: xIMXAllowance,
    error: xIMXAllowanceError,
    refetch: xIMXAllowanceRefetch
  } = useQuery<BigNumber, Error>(
    [
      GENERIC_FETCHER,
      chainId,
      tokenAddress,
      'allowance',
      owner,
      spender
    ],
    (chainId && library && tokenAddress && owner && spender) ?
      genericFetcher<BigNumber>(library, ERC20JSON.abi) :
      Promise.resolve,
    {
      enabled: !!(chainId && library && tokenAddress && owner && spender)
    }
  );
  useErrorHandler(xIMXAllowanceError);

  const approveMutation = useMutation<ContractReceipt, Error, string>(
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

      const bigUnstakingAmount = parseUnits(variables);
      const xIMXContract = getERC20Contract(X_IMX_ADDRESSES[chainId], library, account);
      const spender = STAKING_ROUTER_ADDRESSES[chainId];
      // MEMO: `bigUnstakingAmount` instead of `MaxUint256`
      const tx: ContractTransaction = await xIMXContract.approve(spender, bigUnstakingAmount);
      return await tx.wait();
    },
    {
      onSuccess: (data, variables) => {
        addTransaction({
          hash: data.transactionHash
        }, {
          summary: `Approve of xIMX (${variables}) transfer.`
        });
        xIMXAllowanceRefetch();
      }
    }
  );

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
      if (xIMXAllowance === undefined) {
        throw new Error('Invalid xIMX allowance!');
      }
      if (xIMXBalance === undefined) {
        throw new Error('Invalid xIMX balance!');
      }

      const bigUnstakingAmount = parseUnits(variables);
      const stakingRouterContract = getStakingRouterContract(chainId, library, account);
      const tx: ContractTransaction = await stakingRouterContract.unstake(bigUnstakingAmount);
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
        xIMXBalanceRefetch();
        xIMXAllowanceRefetch();
      }
    }
  );

  const addTransaction = useTransactionAdder();

  const onApprove = async (data: UnstakingFormData) => {
    approveMutation.mutate(data[UNSTAKING_AMOUNT]);
  };

  const onUnstake = async (data: UnstakingFormData) => {
    unstakeMutation.mutate(data[UNSTAKING_AMOUNT]);
  };

  const validateForm = (value: string): string | undefined => {
    if (xIMXAllowance === undefined) {
      throw new Error('Invalid xIMX allowance!');
    }
    if (xIMXBalance === undefined) {
      throw new Error('Invalid xIMX balance!');
    }

    const bigUnstakingAmount = parseUnits(value);
    if (bigUnstakingAmount.gt(xIMXBalance)) {
      return 'Unstaking amount must be less than your xIMX balance!';
    }

    if (xIMXAllowance.gt(Zero) && bigUnstakingAmount.gt(xIMXAllowance)) {
      return 'Unstaking amount must be less than allowance!';
    }

    if (bigUnstakingAmount.eq(Zero)) {
      return 'Unstaking amount must be greater than zero!';
    }

    return undefined;
  };

  let approved;
  let floatXIMXBalance;
  let floatXIMXAllowance;
  if (xIMXBalanceSuccess && xIMXAllowanceSuccess) {
    if (xIMXAllowance === undefined) {
      throw new Error('Invalid xIMX allowance!');
    }
    if (xIMXBalance === undefined) {
      throw new Error('Invalid xIMX balance!');
    }

    approved = xIMXAllowance.gt(Zero);
    floatXIMXBalance = formatNumberWithFixedDecimals(parseFloat(formatUnits(xIMXBalance)), 2);
    floatXIMXAllowance = formatNumberWithFixedDecimals(parseFloat(formatUnits(xIMXAllowance)), 2);
  }

  let submitButtonText;
  if (xIMXBalanceSuccess && xIMXAllowanceSuccess) {
    submitButtonText = approved ? 'Unstake' : 'Approve';
  }
  if (xIMXBalanceIdle || xIMXBalanceLoading || xIMXAllowanceIdle || xIMXAllowanceLoading) {
    submitButtonText = 'Loading...';
  }

  return (
    <>
      <form
        onSubmit={
          (xIMXBalanceSuccess && xIMXAllowanceSuccess) ?
            handleSubmit(approved ? onUnstake : onApprove) :
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
          balance={floatXIMXBalance}
          allowance={floatXIMXAllowance}
          error={!!errors[UNSTAKING_AMOUNT]}
          helperText={errors[UNSTAKING_AMOUNT]?.message}
          tokenUnit='xIMX'
          walletActive={active}
          disabled={!xIMXAllowance || !xIMXBalance} />
        {active ? (
          <SubmitButton
            disabled={xIMXBalanceIdle || xIMXBalanceLoading || xIMXAllowanceIdle || xIMXAllowanceLoading}
            pending={approveMutation.isLoading || unstakeMutation.isLoading}>
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
      {(approveMutation.isError || unstakeMutation.isError) && (
        <ErrorModal
          open={approveMutation.isError || unstakeMutation.isError}
          onClose={() => {
            if (approveMutation.isError) {
              approveMutation.reset();
            }
            if (unstakeMutation.isError) {
              unstakeMutation.reset();
            }
          }}
          title='Error'
          description={
            approveMutation.error?.message || unstakeMutation.error?.message || ''
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
