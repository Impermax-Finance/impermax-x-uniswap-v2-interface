import { useState } from 'react';
import { InteractionModalContainer } from '.';
import { Row, Col } from 'react-bootstrap';
import { PoolTokenType, ApprovalType } from '../../impermax-router/interfaces';
import usePoolToken from '../../hooks/usePoolToken';
import InputAmount from '../InputAmount';
import InteractionButton from '../InteractionButton';
import BorrowAPY from './TransactionRecap/BorrowAPY';
import BorrowFee from './TransactionRecap/BorrowFee';
import useApprove from '../../hooks/useApprove';
import useBorrow from '../../hooks/useBorrow';
import { useSymbol, useMaxBorrowable, useToBigNumber } from '../../hooks/useData';
import RiskMetrics from '../RiskMetrics';
import FarmingAPY from './TransactionRecap/FarmingAPY';

/**
 * Props for the deposit interaction modal.
 * @property show Shows or hides the modal.
 * @property toggleShow A function to update the show variable to show or hide the Modal.
 */
export interface BorrowInteractionModalProps {
  show: boolean;
  toggleShow(s: boolean): void;
}

/**
 * Styled component for the norrow modal.
 * @param param0 any Props for component
 * @see BorrowInteractionModalProps
 */

export default function BorrowInteractionModal({ show, toggleShow }: BorrowInteractionModalProps): JSX.Element {
  const poolTokenType = usePoolToken();
  const [val, setVal] = useState<number>(0);

  const symbol = useSymbol();
  const maxBorrowable = useMaxBorrowable();

  const amount = useToBigNumber(val);
  const invalidInput = val > maxBorrowable;
  const [approvalState, onApprove, permitData] = useApprove(ApprovalType.BORROW, amount, invalidInput);
  const [borrowState, borrow] = useBorrow(approvalState, amount, invalidInput, permitData);
  const onBorrow = async () => {
    await borrow();
    setVal(0);
    toggleShow(false);
  };

  return (
    <InteractionModalContainer
      title='Borrow'
      show={show}
      toggleShow={toggleShow}>
      <>
        <RiskMetrics
          // eslint-disable-next-line eqeqeq
          changeBorrowedA={poolTokenType == PoolTokenType.BorrowableA ? val : 0}
          // eslint-disable-next-line eqeqeq
          changeBorrowedB={poolTokenType == PoolTokenType.BorrowableB ? val : 0} />
        <InputAmount
          val={val}
          setVal={setVal}
          suffix={symbol}
          maxTitle='Available'
          max={maxBorrowable} />
        <div className='transaction-recap'>
          <BorrowFee
            amount={val}
            symbol={symbol} />
          <BorrowAPY amount={val} />
          <FarmingAPY amount={val} />
        </div>
        <Row className='interaction-row'>
          <Col xs={6}>
            <InteractionButton
              name='Approve'
              onCall={onApprove}
              state={approvalState} />
          </Col>
          <Col xs={6}>
            <InteractionButton
              name='Borrow'
              onCall={onBorrow}
              state={borrowState} />
          </Col>
        </Row>
      </>
    </InteractionModalContainer>
  );
}
