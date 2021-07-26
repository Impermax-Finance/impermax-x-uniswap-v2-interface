
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { usePromise } from 'react-use';
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
  ContractTransaction
} from '@ethersproject/contracts';
import clsx from 'clsx';

import TokenAmountLabel from '../TokenAmountLabel';
import TokenAmountField from '../TokenAmountField';
import SubmitButton from '../SubmitButton';
import WalletConnectButton from 'containers/WalletConnectButton';
import ErrorFallback from 'components/ErrorFallback';
import ErrorModal from 'components/ErrorModal';
import { IMX_ADDRESSES } from 'config/web3/contracts/imxes';
import { STAKING_ROUTER_ADDRESSES } from 'config/web3/contracts/staking-routers';
import useTokenBalance from 'utils/hooks/web3/use-token-balance';
import getERC20Contract from 'utils/helpers/web3/get-erc20-contract';
import formatNumberWithFixedDecimals from 'utils/helpers/format-number-with-fixed-decimals';
import STATUSES from 'utils/constants/statuses';
import genericFetcher, { GENERIC_FETCHER } from 'services/fetchers/generic-fetcher';
import ERC20JSON from 'abis/contracts/IERC20.json';
import StakingRouterJSON from 'abis/contracts/IStakingRouter.json';
import { useTransactionAdder } from 'store/transactions/hooks';

const getStakingRouterContract = (chainID: number, library: Web3Provider, account: string) => {
  const stakingRouterAddress = STAKING_ROUTER_ADDRESSES[chainID];
  const signer = library.getSigner(account);

  return new Contract(stakingRouterAddress, StakingRouterJSON.abi, signer);
};

const STAKING_AMOUNT = 'staking-amount';

type StakingFormData = {
  [STAKING_AMOUNT]: string;
}

const StakingForm = (props: React.ComponentPropsWithRef<'form'>): JSX.Element => {
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
  } = useForm<StakingFormData>({
    mode: 'onChange'
  });

  const tokenAddress = chainId ? IMX_ADDRESSES[chainId] : undefined;
  const {
    isIdle: imxBalanceIdle,
    isLoading: imxBalancePending,
    isSuccess: imxBalanceResolved,
    data: imxBalance,
    error: imxBalanceError,
    refetch: imxBalanceRefetch
  } = useTokenBalance(
    chainId,
    library,
    tokenAddress,
    account
  );
  useErrorHandler(imxBalanceError);

  const owner = account;
  const spender = chainId ? STAKING_ROUTER_ADDRESSES[chainId] : undefined;
  const {
    isIdle: imxAllowanceIdle,
    isLoading: imxAllowancePending,
    isSuccess: imxAllowanceResolved,
    data: imxAllowance,
    error: imxAllowanceError,
    refetch: imxAllowanceRefetch
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
  useErrorHandler(imxAllowanceError);

  const mounted = usePromise();
  const addTransaction = useTransactionAdder();

  const [submitStatus, setSubmitStatus] = React.useState(STATUSES.IDLE);
  const [submitError, setSubmitError] = React.useState<Error | null>(null);

  const onStake = async (data: StakingFormData) => {
    if (!chainId) {
      throw new Error('Invalid chain ID!');
    }
    if (!library) {
      throw new Error('Invalid library!');
    }
    if (!account) {
      throw new Error('Invalid account!');
    }
    if (imxBalance === undefined) {
      throw new Error('Invalid IMX balance!');
    }
    if (imxAllowance === undefined) {
      throw new Error('Invalid IMX allowance!');
    }

    try {
      setSubmitStatus(STATUSES.PENDING);
      const bigStakingAmount = parseUnits(data[STAKING_AMOUNT]);
      const stakingRouterContract = getStakingRouterContract(chainId, library, account);
      const tx: ContractTransaction = await mounted(stakingRouterContract.stake(bigStakingAmount));
      const receipt = await mounted(tx.wait());
      addTransaction({
        hash: receipt.transactionHash
      }, {
        summary: `Stake IMX (${data[STAKING_AMOUNT]}).`
      });
      reset({
        [STAKING_AMOUNT]: ''
      });
      imxAllowanceRefetch();
      imxBalanceRefetch();
      setSubmitStatus(STATUSES.RESOLVED);
    } catch (error) {
      setSubmitStatus(STATUSES.REJECTED);
      setSubmitError(error);
    }
  };

  const onApprove = async (data: StakingFormData) => {
    if (!chainId) {
      throw new Error('Invalid chain ID!');
    }
    if (!library) {
      throw new Error('Invalid library!');
    }
    if (!account) {
      throw new Error('Invalid account!');
    }

    try {
      setSubmitStatus(STATUSES.PENDING);
      const bigStakingAmount = parseUnits(data[STAKING_AMOUNT]);
      const imxContract = getERC20Contract(IMX_ADDRESSES[chainId], library, account);
      const spender = STAKING_ROUTER_ADDRESSES[chainId];
      // MEMO: `bigStakingAmount` instead of `MaxUint256`
      const tx: ContractTransaction = await mounted(imxContract.approve(spender, bigStakingAmount));
      const receipt = await mounted(tx.wait());
      imxAllowanceRefetch();
      addTransaction({
        hash: receipt.transactionHash
      }, {
        summary: `Approve of IMX (${data[STAKING_AMOUNT]}) transfer.`
      });
      setSubmitStatus(STATUSES.RESOLVED);
    } catch (error) {
      setSubmitStatus(STATUSES.REJECTED);
      setSubmitError(error);
    }
  };

  const validateForm = (value: string): string | undefined => {
    if (imxBalance === undefined) {
      throw new Error('Invalid IMX balance!');
    }
    if (imxAllowance === undefined) {
      throw new Error('Invalid IMX allowance!');
    }

    const bigStakingAmount = parseUnits(value);
    if (bigStakingAmount.gt(imxBalance)) {
      return 'Staking amount must be less than your IMX balance!';
    }

    if (imxAllowance.gt(Zero) && bigStakingAmount.gt(imxAllowance)) {
      return 'Staking amount must be less than allowance!';
    }

    if (bigStakingAmount.eq(Zero)) {
      return 'Staking amount must be greater than zero!';
    }

    return undefined;
  };

  let approved;
  let floatIMXBalance;
  let floatIMXAllowance;
  if (imxBalanceResolved && imxAllowanceResolved) {
    if (imxBalance === undefined) {
      throw new Error('Invalid IMX balance!');
    }
    if (imxAllowance === undefined) {
      throw new Error('Invalid IMX allowance!');
    }

    approved = imxAllowance.gt(Zero);
    floatIMXBalance = formatNumberWithFixedDecimals(parseFloat(formatUnits(imxBalance)), 2);
    floatIMXAllowance = formatNumberWithFixedDecimals(parseFloat(formatUnits(imxAllowance)), 2);
  }

  let submitButtonText;
  if (imxBalanceResolved && imxAllowanceResolved) {
    submitButtonText = approved ? 'Stake' : 'Approve';
  }
  if (imxBalanceIdle || imxBalancePending || imxAllowanceIdle || imxAllowancePending) {
    submitButtonText = 'Loading...';
  }

  return (
    <>
      <form
        onSubmit={
          (imxBalanceResolved && imxAllowanceResolved) ?
            handleSubmit(approved ? onStake : onApprove) :
            undefined
        }
        {...props}>
        <TokenAmountLabel
          htmlFor={STAKING_AMOUNT}
          text='Stake IMX' />
        <TokenAmountField
          id={STAKING_AMOUNT}
          {...register(STAKING_AMOUNT, {
            required: {
              value: true,
              message: 'This field is required!'
            },
            validate: value => validateForm(value)
          })}
          balance={floatIMXBalance}
          allowance={floatIMXAllowance}
          error={!!errors[STAKING_AMOUNT]}
          helperText={errors[STAKING_AMOUNT]?.message}
          tokenUnit='IMX'
          walletActive={active}
          disabled={!imxAllowance || !imxBalance} />
        {active ? (
          <SubmitButton
            disabled={imxBalanceIdle || imxBalancePending || imxAllowanceIdle || imxAllowancePending}
            pending={submitStatus === STATUSES.PENDING}>
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
      {(submitStatus === STATUSES.REJECTED && submitError) && (
        <ErrorModal
          open={!!submitError}
          onClose={() => {
            setSubmitStatus(STATUSES.IDLE);
            setSubmitError(null);
          }}
          title='Error'
          description={submitError.message} />
      )}
    </>
  );
};

export default withErrorBoundary(StakingForm, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
