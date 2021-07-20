
import * as React from 'react';
import { useForm } from 'react-hook-form';
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
import { X_IMX_ADDRESSES } from 'config/web3/contracts/x-imxes';
import { STAKING_ROUTER_ADDRESSES } from 'config/web3/contracts/staking-routers';
import getERC20Contract from 'utils/helpers/web3/get-erc20-contract';
import formatNumberWithFixedDecimals from 'utils/helpers/format-number-with-fixed-decimals';
import STATUSES from 'utils/constants/statuses';
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

  const handleError = useErrorHandler();
  const mounted = usePromise();
  const addTransaction = useTransactionAdder();

  const [status, setStatus] = React.useState(STATUSES.IDLE);
  const [submitStatus, setSubmitStatus] = React.useState(STATUSES.IDLE);
  const [submitError, setSubmitError] = React.useState<Error | null>(null);
  const [xIMXBalance, setXIMXBalance] = React.useState<BigNumber>();
  const [xIMXAllowance, setXIMXAllowance] = React.useState<BigNumber>();

  React.useEffect(() => {
    if (!chainId) return;
    if (!library) return;
    if (!account) return;
    if (!handleError) return;
    if (!mounted) return;

    (async () => {
      try {
        setStatus(STATUSES.PENDING);
        const xIMXContract = getERC20Contract(X_IMX_ADDRESSES[chainId], library, account);
        const theXIMXBalance: BigNumber = await mounted(xIMXContract.balanceOf(account));
        setXIMXBalance(theXIMXBalance);
        const owner = account;
        const spender = STAKING_ROUTER_ADDRESSES[chainId];
        const theXIMXAllowance: BigNumber = await mounted(xIMXContract.allowance(owner, spender));
        setXIMXAllowance(theXIMXAllowance);
        setStatus(STATUSES.RESOLVED);
      } catch (error) {
        setStatus(STATUSES.REJECTED);
        handleError(error);
      }
    })();
  }, [
    chainId,
    library,
    account,
    handleError,
    mounted
  ]);

  const onUnstake = async (data: UnstakingFormData) => {
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

    try {
      setSubmitStatus(STATUSES.PENDING);
      const bigUnstakingAmount = parseUnits(data[UNSTAKING_AMOUNT]);
      const stakingRouterContract = getStakingRouterContract(chainId, library, account);
      const tx: ContractTransaction = await mounted(stakingRouterContract.unstake(bigUnstakingAmount));
      const receipt = await mounted(tx.wait());
      addTransaction({
        hash: receipt.transactionHash
      }, {
        summary: `Unstake IMX (${data[UNSTAKING_AMOUNT]}).`
      });
      reset({
        [UNSTAKING_AMOUNT]: ''
      });
      const newXIMXAllowance = xIMXAllowance.sub(bigUnstakingAmount);
      setXIMXAllowance(newXIMXAllowance);
      const newXIMXBalance = xIMXBalance.sub(bigUnstakingAmount);
      setXIMXBalance(newXIMXBalance);
      setSubmitStatus(STATUSES.RESOLVED);
    } catch (error) {
      setSubmitStatus(STATUSES.REJECTED);
      setSubmitError(error);
    }
  };

  const onApprove = async (data: UnstakingFormData) => {
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
      const bigUnstakingAmount = parseUnits(data[UNSTAKING_AMOUNT]);
      const xIMXContract = getERC20Contract(X_IMX_ADDRESSES[chainId], library, account);
      const spender = STAKING_ROUTER_ADDRESSES[chainId];
      // MEMO: `bigUnstakingAmount` instead of `MaxUint256`
      const tx: ContractTransaction = await mounted(xIMXContract.approve(spender, bigUnstakingAmount));
      const receipt = await mounted(tx.wait());
      setXIMXAllowance(bigUnstakingAmount);
      addTransaction({
        hash: receipt.transactionHash
      }, {
        summary: `Approve of xIMX (${data[UNSTAKING_AMOUNT]}) transfer.`
      });
      setSubmitStatus(STATUSES.RESOLVED);
    } catch (error) {
      setSubmitStatus(STATUSES.REJECTED);
      setSubmitError(error);
    }
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
  if (status === STATUSES.RESOLVED) {
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
  if (status === STATUSES.RESOLVED) {
    submitButtonText = approved ? 'Unstake' : 'Approve';
  }
  if (status === STATUSES.IDLE || status === STATUSES.PENDING) {
    submitButtonText = 'Loading...';
  }

  return (
    <>
      <form
        onSubmit={
          status === STATUSES.RESOLVED ?
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
          walletActive={active} />
        {active ? (
          <SubmitButton
            disabled={status === STATUSES.IDLE || status === STATUSES.PENDING}
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

export default withErrorBoundary(UnstakingForm, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
