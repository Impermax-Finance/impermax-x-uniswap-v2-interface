
// ray test touch <<
import * as React from 'react';
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

// ray test touch <<<
const getStakingRouterContract = (chainID: number, library: Web3Provider, account: string) => {
  const stakingRouterAddress = STAKING_ROUTER_ADDRESSES[chainID];
  const signer = library.getSigner(account);

  return new Contract(stakingRouterAddress, StakingRouterJSON.abi, signer);
};
// ray test touch >>>

const StakingForm = (props: React.ComponentPropsWithRef<'form'>): JSX.Element => {
  // ray test touch <<<
  const {
    chainId,
    account,
    library
  } = useWeb3React<Web3Provider>();

  const [imxBalance, setIMXBalance] = React.useState<number>();
  const [imxAllowance, setIMXAllowance] = React.useState<BigNumber>();
  const [stakingAmount, setStakingAmount] = React.useState<number>(0);

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
  // ray test touch >>>

  // ray test touch <<<
  const handleStake = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (!chainId) {
      throw new Error('Invalid chain ID!');
    }
    if (!library) {
      throw new Error('Invalid library!');
    }
    if (!account) {
      throw new Error('Invalid account!');
    }

    const stakingRouterContract = getStakingRouterContract(chainId, library, account);
    const bigStakingAmount = parseUnits(stakingAmount.toString());
    const tx = await stakingRouterContract.stake(bigStakingAmount);
    const receipt = await tx.wait();
    console.log('ray : ***** receipt => ', receipt);
  };

  const handleStakingAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStakingAmount(Number(event.currentTarget.value));
  };

  console.log('ray : ***** imxAllowance?.toString() => ', imxAllowance?.toString());
  console.log('ray : ***** imxBalance => ', imxBalance);
  // ray test touch >>>

  // ray test touch <<<
  // const bigStakingAmount = parseUnits(stakingAmount.toString());
  // const invalidInput = stakingAmount > imxBalance;
  // const [approvalState, onApprove] = useApprove(ApprovalType.STAKE, bigStakingAmount, invalidInput);
  // const [stakeState, onStake] = useStake(approvalState, bigStakingAmount, invalidInput);
  // ray test touch >>>

  return (
    <form
      onSubmit={handleStake}
      {...props}>
      <TokenAmountLabel
        htmlFor='staking-amount'
        text='Stake IMX' />
      <TokenAmountField
        id='staking-amount'
        name='staking-amount'
        balance={imxBalance}
        onChange={handleStakingAmountChange} />
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
};

export default StakingForm;
// ray test touch >>
