
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
import useApprove from 'hooks/useApprove';
import useUnstake from 'hooks/useUnstake';
import { X_IMX_ADDRESSES } from 'config/web3/contracts/x-imx';
import { ApprovalType } from 'types/interfaces';

const UnstakingForm = (props: React.ComponentPropsWithRef<'form'>): JSX.Element => {
  const { chainId } = useWeb3React<Web3Provider>();
  const tokenBalance = useTokenBalance(X_IMX_ADDRESSES[chainId as number]);

  const [val, setVal] = React.useState<number>(0);
  const tokens = useToBigNumber(val, undefined, 18);
  const invalidInput = val > tokenBalance;

  const [approvalState, onApprove] = useApprove(ApprovalType.UNSTAKE, tokens, invalidInput);
  const [unstakeState, onUnstake] = useUnstake(approvalState, tokens, invalidInput);
  return (
    <form {...props}>
      <TokenAmountLabel
        htmlFor='unstaking-amount'
        text='Unstake IMX' />
      {/* <TokenAmountField /> */}
      <InputAmount
        val={val}
        setVal={setVal}
        suffix='xIMX'
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
                name='Unstake'
                onCall={onUnstake}
                state={unstakeState} />
            </Col>
          )
        }
      </Row>
    </form>
  );
};

export default UnstakingForm;
// ray test touch >>
