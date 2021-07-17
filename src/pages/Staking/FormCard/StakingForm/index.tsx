
// ray test touch <<
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

import TokenAmountLabel from '../TokenAmountLabel';
import TokenAmountField from '../TokenAmountField';
import SubmitButton from '../SubmitButton';
import ErrorFallback from 'components/ErrorFallback';
import ErrorModal from 'components/ErrorModal';
import LineLoadingSpinner from 'components/LineLoadingSpinner';
import getERC20Contract from 'utils/helpers/web3/get-erc20-contract';
import { IMX_ADDRESSES } from 'config/web3/contracts/imx';
import formatNumberWithFixedDecimals from 'utils/helpers/format-number-with-fixed-decimals';
import { STAKING_ROUTER_ADDRESSES } from 'config/web3/contracts/staking-routers';
import StakingRouterJSON from 'abis/contracts/IStakingRouter.json';
import STATUSES from 'utils/constants/statuses';

const getStakingRouterContract = (chainID: number, library: Web3Provider, account: string) => {
  const stakingRouterAddress = STAKING_ROUTER_ADDRESSES[chainID];
  const signer = library.getSigner(account);

  return new Contract(stakingRouterAddress, StakingRouterJSON.abi, signer);
};

const STAKING_AMOUNT = 'staking-amount';

type StakingFormData = {
  [STAKING_AMOUNT]: string;
}

const StakingForm = (props: React.ComponentPropsWithRef<'form'>): JSX.Element | null => {
  const {
    chainId,
    account,
    library
  } = useWeb3React<Web3Provider>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<StakingFormData>({
    mode: 'onChange'
  });

  const handleError = useErrorHandler();
  const mounted = usePromise();

  const [status, setStatus] = React.useState(STATUSES.IDLE);
  const [submitStatus, setSubmitStatus] = React.useState(STATUSES.IDLE);
  const [submitError, setSubmitError] = React.useState<Error | null>(null);
  const [imxBalance, setIMXBalance] = React.useState<BigNumber>();
  const [imxAllowance, setIMXAllowance] = React.useState<BigNumber>();

  React.useEffect(() => {
    if (!chainId) return;
    if (!library) return;
    if (!account) return;
    if (!handleError) return;
    if (!mounted) return;

    (async () => {
      try {
        setStatus(STATUSES.PENDING);
        const imxContract = getERC20Contract(IMX_ADDRESSES[chainId], library, account);
        const theIMXBalance: BigNumber = await mounted(imxContract.balanceOf(account));
        setIMXBalance(theIMXBalance);
        const owner = account;
        const spender = STAKING_ROUTER_ADDRESSES[chainId];
        const theIMXAllowance: BigNumber = await mounted(imxContract.allowance(owner, spender));
        setIMXAllowance(theIMXAllowance);
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

  if (status === STATUSES.IDLE || status === STATUSES.PENDING) {
    return (
      <LineLoadingSpinner />
    );
  }

  if (status === STATUSES.RESOLVED) {
    if (imxAllowance === undefined) {
      throw new Error('Undefined IMX allowance!');
    }
    if (imxBalance === undefined) {
      throw new Error('Undefined IMX balance!');
    }

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

      try {
        setSubmitStatus(STATUSES.PENDING);
        const bigStakingAmount = parseUnits(data[STAKING_AMOUNT]);
        const stakingRouterContract = getStakingRouterContract(chainId, library, account);
        const tx: ContractTransaction = await mounted(stakingRouterContract.stake(bigStakingAmount));
        const receipt = await mounted(tx.wait());
        console.log('ray : ***** receipt => ', receipt);
        reset({
          [STAKING_AMOUNT]: ''
        });
        const newIMXAllowance = imxAllowance.sub(bigStakingAmount);
        setIMXAllowance(newIMXAllowance);
        const newIMXBalance = imxBalance.sub(bigStakingAmount);
        setIMXBalance(newIMXBalance);
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
        setIMXAllowance(bigStakingAmount);
        console.log('ray : ***** receipt => ', receipt);
        setSubmitStatus(STATUSES.RESOLVED);
      } catch (error) {
        setSubmitStatus(STATUSES.REJECTED);
        setSubmitError(error);
      }
    };

    const validateForm = (value: string): string | undefined => {
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

    const approved = imxAllowance.gt(Zero);
    const floatIMXBalance = formatNumberWithFixedDecimals(parseFloat(formatUnits(imxBalance)), 2);
    const floatIMXAllowance = formatNumberWithFixedDecimals(parseFloat(formatUnits(imxAllowance)), 2);

    return (
      <>
        <form
          onSubmit={
            handleSubmit(approved ? onStake : onApprove)
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
            helperText={errors[STAKING_AMOUNT]?.message} />
          <SubmitButton pending={submitStatus === STATUSES.PENDING}>
            {approved ? 'Stake' : 'Approve'}
          </SubmitButton>
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
  }

  return null;
};

export default withErrorBoundary(StakingForm, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
// ray test touch >>
