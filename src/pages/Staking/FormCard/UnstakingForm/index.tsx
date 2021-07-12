
import clsx from 'clsx';

import ImpermaxCarnationBadge from '../../../../components/badges/ImpermaxCarnationBadge';
import { useToBigNumber, useTokenBalance, useXIMXRate } from '../../../../hooks/useData';
import { formatFloat } from '../../../../utils/format';
import InteractionButton, { ButtonState } from '../../../../components/InteractionButton';
import { Col, Row } from 'react-bootstrap';
import { ApprovalType } from '../../../../types/interfaces';
import useApprove from '../../../../hooks/useApprove';
import InputAmount from '../../../../components/InputAmount';
import { XIMX_ADDRESSES } from '../../../../config/web3/contracts/ximx';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useState } from 'react';
import useUnstake from '../../../../hooks/useUnstake';

const UnstakingForm = (props: React.ComponentPropsWithRef<'form'>): JSX.Element => {
  const rate = useXIMXRate();
  const { chainId } = useWeb3React<Web3Provider>();
  const tokenBalance = useTokenBalance(XIMX_ADDRESSES[chainId as number]);

  const [val, setVal] = useState<number>(0);
  const tokens = useToBigNumber(val, undefined, 18);
  const invalidInput = val > tokenBalance;

  const [approvalState, onApprove] = useApprove(ApprovalType.UNSTAKE, tokens, invalidInput);
  const [unstakeState, onUnstake] = useUnstake(approvalState, tokens, invalidInput);
  return (
    <form {...props}>
      <div
        className={clsx(
          'flex',
          'justify-between',
          'items-center'
        )}>
        <span
          className={clsx(
            'text-2xl',
            'font-medium'
          )}>
          Unstake IMX
        </span>
        <ImpermaxCarnationBadge>1 xIMX = {formatFloat(rate)} IMX</ImpermaxCarnationBadge>
      </div>
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
