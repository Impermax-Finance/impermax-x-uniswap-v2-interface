import { useState } from 'react';
import { InteractionModalContainer } from '.';
import { Row, Col } from 'react-bootstrap';
import { ApprovalType } from '../../types/interfaces';
import InputAmount from '../InputAmount';
import InteractionButton from '../InteractionButton';
import BorrowAPY from './TransactionRecap/BorrowAPY';
import BorrowFee from './TransactionRecap/BorrowFee';
import useApprove from '../../hooks/useApprove';
import useBorrow from '../../hooks/useBorrow';
import { useSymbol, useMaxBorrowable, useToBigNumber } from '../../hooks/useData';
import RiskMetrics from '../RiskMetrics';
import FarmingAPY from './TransactionRecap/FarmingAPY';
import getLeverage from 'utils/helpers/get-leverage';
import getLiquidationPrices from 'utils/helpers/get-liquidation-prices';

/**
 * Props for the deposit interaction modal.
 * @property show Shows or hides the modal.
 * @property toggleShow A function to update the show variable to show or hide the Modal.
 */
export interface BorrowInteractionModalProps {
  show: boolean;
  toggleShow(s: boolean): void;
  safetyMargin: number;
  liquidationIncentive: number;
  twapPrice: number;
  valueCollateralWithoutChanges: number;
  valueAWithoutChanges: number;
  valueBWithoutChanges: number;
}

/**
 * Styled component for the narrow modal.
 * @param param0 any Props for component
 * @see BorrowInteractionModalProps
 */

export default function BorrowInteractionModal({
  show,
  toggleShow,
  safetyMargin,
  liquidationIncentive,
  twapPrice,
  valueCollateralWithoutChanges,
  valueAWithoutChanges,
  valueBWithoutChanges
}: BorrowInteractionModalProps): JSX.Element {
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

  const changes = {
    changeCollateral: 0,
    changeBorrowedA: val,
    changeBorrowedB: val
  };
  const valueCollateral = valueCollateralWithoutChanges + changes.changeCollateral;
  const valueA = valueAWithoutChanges + changes.changeBorrowedA;
  const valueB = valueBWithoutChanges + changes.changeBorrowedB;
  const currentLiquidationPrices =
    getLiquidationPrices(
      valueCollateralWithoutChanges,
      valueAWithoutChanges,
      valueBWithoutChanges,
      twapPrice,
      safetyMargin,
      liquidationIncentive
    );
  const newLiquidationPrices =
    getLiquidationPrices(
      valueCollateral,
      valueA,
      valueB,
      twapPrice,
      safetyMargin,
      liquidationIncentive
    );
  const currentLeverage = getLeverage(valueCollateral, valueA, valueB);
  const newLeverage = getLeverage(valueCollateral, valueA, valueB, changes);

  return (
    <InteractionModalContainer
      title='Borrow'
      show={show}
      toggleShow={toggleShow}>
      <>
        <RiskMetrics
          safetyMargin={safetyMargin}
          twapPrice={twapPrice}
          changes={changes}
          currentLeverage={currentLeverage}
          newLeverage={newLeverage}
          currentLiquidationPrices={currentLiquidationPrices}
          newLiquidationPrices={newLiquidationPrices} />
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
