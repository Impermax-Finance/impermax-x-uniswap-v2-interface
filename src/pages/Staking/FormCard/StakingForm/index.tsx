
// ray test touch <<
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import {
  formatUnits,
  parseUnits
} from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';
import { Contract } from '@ethersproject/contracts';
// ray test touch <<<
// import { Col, Row } from 'react-bootstrap';
// ray test touch >>>

import TokenAmountLabel from '../TokenAmountLabel';
// ray test touch <<<
import TokenAmountField from '../TokenAmountField';
import SubmitButton from '../SubmitButton';
// import InteractionButton, { ButtonState } from 'components/InteractionButton';
// import InputAmount from 'components/InputAmount';
// ray test touch >>>
import getERC20Contract from 'utils/helpers/web3/get-erc20-contract';
// ray test touch <<<
// import useStake from 'hooks/useStake';
// import useApprove from 'hooks/useApprove';
// ray test touch >>>
import { IMX_ADDRESSES } from 'config/web3/contracts/imx';
import formatNumberWithFixedDecimals from 'utils/helpers/format-number-with-fixed-decimals';
// ray test touch <<<
import { STAKING_ROUTER_ADDRESSES } from 'config/web3/contracts/staking-routers';
import StakingRouterJSON from 'abis/contracts/IStakingRouter.json';
// import { ApprovalType } from 'types/interfaces';
// ray test touch >>>

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

  const [imxBalance, setIMXBalance] = React.useState<number>();
  const [imxAllowance, setIMXAllowance] = React.useState<BigNumber>();

  React.useEffect(() => {
    if (!chainId) return;
    if (!library) return;
    if (!account) return;

    (async () => {
      try {
        const imxContract = getERC20Contract(IMX_ADDRESSES[chainId], library, account);
        const bigIMXBalance: BigNumber = await imxContract.balanceOf(account);
        const floatIMXBalance = parseFloat(formatUnits(bigIMXBalance));
        const theIMXBalance = formatNumberWithFixedDecimals(floatIMXBalance, 2);
        setIMXBalance(theIMXBalance);
        const owner = account;
        const spender = STAKING_ROUTER_ADDRESSES[chainId];
        const theIMXAllowance = await imxContract.allowance(owner, spender);
        setIMXAllowance(theIMXAllowance);
      } catch (error) {
        console.log('[StakingForm useEffect] error.message => ', error.message);
      }
    })();
  }, [
    chainId,
    library,
    account
  ]);

  const onSubmit = async (data: StakingFormData) => {
    if (!chainId) {
      throw new Error('Invalid chain ID!');
    }
    if (!library) {
      throw new Error('Invalid library!');
    }
    if (!account) {
      throw new Error('Invalid account!');
    }

    const bigStakingAmount = parseUnits(data[STAKING_AMOUNT]);
    const stakingRouterContract = getStakingRouterContract(chainId, library, account);
    const tx = await stakingRouterContract.stake(bigStakingAmount);
    await tx.wait();
    reset({
      [STAKING_AMOUNT]: ''
    });
  };

  console.log('ray : ***** imxAllowance?.toString() => ', imxAllowance?.toString());
  console.log('ray : ***** imxBalance => ', imxBalance);
  const validateForm = (value: string): string | undefined => {
    console.log('ray : ***** value => ', value);
    return undefined;
  };

  // ray test touch <<<
  // const bigStakingAmount = parseUnits(stakingAmount.toString());
  // const invalidInput = stakingAmount > imxBalance;
  // const [approvalState, onApprove] = useApprove(ApprovalType.STAKE, bigStakingAmount, invalidInput);
  // const [stakeState, onStake] = useStake(approvalState, bigStakingAmount, invalidInput);
  // ray test touch >>>

  // ray test touch <<<
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
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
        balance={imxBalance}
        error={!!errors[STAKING_AMOUNT]}
        helperText={errors[STAKING_AMOUNT]?.message} />
      <SubmitButton>
        Stake
      </SubmitButton>
    </form>
    // <form {...props}>
    //   <TokenAmountLabel
    //     htmlFor='staking-amount'
    //     text='Stake IMX' />
    //   <InputAmount
    //     val={stakingAmount}
    //     setVal={setStakingAmount}
    //     suffix='IMX'
    //     maxTitle='Available'
    //     max={imxBalance} />
    //   <Row className='interaction-row'>
    //     {/* eslint-disable-next-line no-negated-condition */}
    //     {approvalState !== ButtonState.Done ?
    //       (
    //         <Col xs={12}>
    //           <InteractionButton
    //             name='Approve'
    //             onCall={onApprove}
    //             state={approvalState} />
    //         </Col>
    //       ) : (
    //         <Col xs={12}>
    //           <InteractionButton
    //             name='Stake'
    //             onCall={onStake}
    //             state={stakeState} />
    //         </Col>
    //       )
    //     }
    //   </Row>
    // </form>
  );
  // ray test touch >>>
};

export default StakingForm;
// ray test touch >>
