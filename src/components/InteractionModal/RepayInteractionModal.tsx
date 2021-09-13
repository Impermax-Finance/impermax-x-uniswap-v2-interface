import { useState } from 'react';
import { InteractionModalContainer } from '.';
import { Row, Col } from 'react-bootstrap';
import { ApprovalType } from '../../types/interfaces';
import RiskMetrics from '../RiskMetrics';
import InputAmount from '../InputAmount';
import InteractionButton from '../InteractionButton';
import useApprove from '../../hooks/useApprove';
import useRepay from '../../hooks/useRepay';
import {
  useSymbol,
  useAvailableBalance,
  useToBigNumber
} from '../../hooks/useData';
import getLeverage from 'utils/helpers/get-leverage';

/**
 * Props for the deposit interaction modal.
 * @property show Shows or hides the modal.
 * @property toggleShow A function to update the show variable to show or hide the Modal.
 */
export interface RepayInteractionModalProps {
  show: boolean;
  toggleShow(s: boolean): void;
  tokenBorrowed: number;
  safetyMargin: number;
  twapPrice: number;
  valueCollateralWithoutChanges: number;
  valueAWithoutChanges: number;
  valueBWithoutChanges: number;
}

/**
 * Styled component for the narrow modal.
 * @param param0 any Props for component
 * @see RepayInteractionModalProps
 */

export default function RepayInteractionModal({
  show,
  toggleShow,
  tokenBorrowed,
  safetyMargin,
  twapPrice,
  valueCollateralWithoutChanges,
  valueAWithoutChanges,
  valueBWithoutChanges
}: RepayInteractionModalProps): JSX.Element {
  const [val, setVal] = useState<number>(0);

  const symbol = useSymbol();
  const availableBalance = useAvailableBalance();

  const amount = useToBigNumber(val);
  const invalidInput = val > Math.min(availableBalance, tokenBorrowed);
  const [approvalState, onApprove] = useApprove(ApprovalType.UNDERLYING, amount, invalidInput);
  const [repayState, repay] = useRepay(approvalState, amount, invalidInput);
  const onRepay = async () => {
    await repay();
    setVal(0);
    toggleShow(false);
  };

  const changes = {
    changeCollateral: 0,
    changeBorrowedA: -val,
    changeBorrowedB: -val
  };
  const valueCollateral = valueCollateralWithoutChanges + changes.changeCollateral;
  const valueA = valueAWithoutChanges + changes.changeBorrowedA;
  const valueB = valueBWithoutChanges + changes.changeBorrowedB;
  const currentLeverage = getLeverage(valueCollateral, valueA, valueB);
  const newLeverage = getLeverage(valueCollateral, valueA, valueB, changes);

  return (
    <InteractionModalContainer
      title='Repay'
      show={show}
      toggleShow={toggleShow}>
      <>
        <RiskMetrics
          safetyMargin={safetyMargin}
          twapPrice={twapPrice}
          changes={changes}
          currentLeverage={currentLeverage}
          newLeverage={newLeverage} />
        <InputAmount
          val={val}
          setVal={setVal}
          suffix={symbol}
          maxTitle='Available'
          max={Math.min(availableBalance, tokenBorrowed)} />
        <Row className='interaction-row'>
          <Col xs={6}>
            <InteractionButton
              name='Approve'
              onCall={onApprove}
              state={approvalState} />
          </Col>
          <Col xs={6}>
            <InteractionButton
              name='Repay'
              onCall={onRepay}
              state={repayState} />
          </Col>
        </Row>
      </>
    </InteractionModalContainer>
  );
}
