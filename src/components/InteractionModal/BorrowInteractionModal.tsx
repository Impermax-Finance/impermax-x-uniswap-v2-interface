import React, { useCallback, useState, useEffect } from "react";
import InteractionModal, { InteractionModalHeader, InteractionModalBody, InteractionModalContainer } from ".";
import { InputGroup, Button, FormControl, Row, Col } from "react-bootstrap";
import NumericalInput from "../NumericalInput";
import { PoolTokenType, ApprovalType } from "../../impermax-router/interfaces";
import usePoolToken from "../../hooks/usePoolToken";
import InputAmount from "../InputAmount";
import InteractionButton, { ButtonState } from "../InteractionButton";
import BorrowAPY from "./TransactionRecap/BorrowAPY";
import BorrowFee from "./TransactionRecap/BorrowFee";
import { decimalToBalance } from "../../utils/ether-utils";
import useApprove from "../../hooks/useApprove";
import useBorrow from "../../hooks/useBorrow";
import { useSymbol, useDecimals, useMaxBorrowable, useToBigNumber, useBorrowerList } from "../../hooks/useData";
import RiskMetrics from "../RiskMetrics";

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
export default function BorrowInteractionModal({show, toggleShow}: BorrowInteractionModalProps) {
  const poolTokenType = usePoolToken();
  const [val, setVal] = useState<number>(0);

  const symbol = useSymbol();
  const symbolLP = useSymbol(PoolTokenType.Collateral);
  const maxBorrowable = useMaxBorrowable();

  const amount = useToBigNumber(val);
  const invalidInput = val > maxBorrowable;
  const [approvalState, onApprove, permitData] = useApprove(ApprovalType.BORROW, amount, invalidInput);
  const [borrowState, borrow] = useBorrow(approvalState, amount, invalidInput, permitData);
  const onBorrow = async () => {
    await borrow();
    setVal(0);
  }

  if (maxBorrowable === 0) return (
    <InteractionModalContainer title="Borrow" show={show} toggleShow={toggleShow}><>
      You need to deposit {symbolLP} as collateral in order to be able to borrow {symbol}.
    </></InteractionModalContainer>
  );

  return (
    <InteractionModalContainer title="Borrow" show={show} toggleShow={toggleShow}><>
      <RiskMetrics
        changeBorrowedA={poolTokenType == PoolTokenType.BorrowableA ? val : 0}
        changeBorrowedB={poolTokenType == PoolTokenType.BorrowableB ? val : 0}
      />
      <InputAmount 
        val={val}
        setVal={setVal}
        suffix={symbol}
        maxTitle={'Available'}
        max={maxBorrowable}
      />
      <div className="transaction-recap">
        <BorrowFee amount={val} symbol={symbol} />
        <BorrowAPY />
      </div>
      <Row className="interaction-row">
        <Col xs={6}>
          <InteractionButton name="Approve" onCall={onApprove} state={approvalState} />
        </Col>
        <Col xs={6}>
          <InteractionButton name="Borrow" onCall={onBorrow} state={borrowState} />
        </Col>
      </Row>
    </></InteractionModalContainer>
  );
}