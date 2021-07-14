
// ray test touch <<
import * as React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { Col, Row } from 'react-bootstrap';

import TokenAmountLabel from '../TokenAmountLabel';
import InteractionButton, { ButtonState } from 'components/InteractionButton';
import InputAmount from 'components/InputAmount';
import {
  useToBigNumber,
  useTokenBalance
} from 'hooks/useData';
import useStake from 'hooks/useStake';
import useApprove from 'hooks/useApprove';
import { IMX_ADDRESSES } from 'config/web3/contracts/imx';
import { ApprovalType } from 'types/interfaces';

const StakingForm = (props: React.ComponentPropsWithRef<'form'>): JSX.Element => {
  const { chainId } = useWeb3React<Web3Provider>();
  const tokenBalance = useTokenBalance(IMX_ADDRESSES[chainId as number]);

  const [val, setVal] = React.useState<number>(0);
  const amount = useToBigNumber(val, undefined, 18);
  const invalidInput = val > tokenBalance;

  const [approvalState, onApprove] = useApprove(ApprovalType.STAKE, amount, invalidInput);
  const [stakeState, onStake] = useStake(approvalState, amount, invalidInput);
  return (
    <form {...props}>
      <TokenAmountLabel
        htmlFor='staking-amount'
        text='Stake IMX' />
      {/* <TokenAmountField /> */}
      <InputAmount
        val={val}
        setVal={setVal}
        suffix='IMX'
        maxTitle='Available'
        max={tokenBalance} />
      <Row className='interaction-row'>
        {/* eslint-disable-next-line no-negated-condition */}
        {approvalState !== ButtonState.Done ?
          (
            <Col xs={12}>
              <InteractionButton
                name='Approve'
                onCall={onApprove}
                state={approvalState} />
            </Col>
          ) : (
            <Col xs={12}>
              <InteractionButton
                name='Stake'
                onCall={onStake}
                state={stakeState} />
            </Col>
          )
        }
      </Row>
    </form>
  );
};

export default StakingForm;
// ray test touch >>
