import React, { useState } from "react";
import InteractionModal, { InteractionModalHeader, InteractionModalBody } from ".";
import { InputGroup, Button, FormControl, Row, Col } from "react-bootstrap";
import NumericalInput from "../NumericalInput";
import { PoolTokenType, ApprovalType } from "../../impermax-router/interfaces";
import usePoolToken from "../../hooks/usePoolToken";
import RiskMetrics from "../RiskMetrics";
import InputAmount from "../InputAmount";
import InteractionButton, { ButtonState } from "../InteractionButton";
import { formatUSD } from "../../utils/format";
import { decimalToBalance } from "../../utils/ether-utils";
import useApprove from "../../hooks/useApprove";
import useRepay from "../../hooks/useRepay";
import { useSymbol, useDecimals, useAvailableBalance, useBorrowed, useToBigNumber } from "../../hooks/useData";

/**
 * Props for the deposit interaction modal.
 * @property show Shows or hides the modal.
 * @property toggleShow A function to update the show variable to show or hide the Modal.
 */
export interface RepayInteractionModalProps {
  show: boolean;
  toggleShow(s: boolean): void;
}

/**
 * Styled component for the norrow modal.
 * @param param0 any Props for component
 * @see RepayInteractionModalProps
 */
export default function RepayInteractionModal({show, toggleShow}: RepayInteractionModalProps) {
  const poolTokenType = usePoolToken();
  const [val, setVal] = useState<number>(0);

  const symbol = useSymbol();
  const availableBalance = useAvailableBalance();
  const borrowed = useBorrowed();

  const amount = useToBigNumber(val);
  const [approvalState, onApprove,] = useApprove(ApprovalType.UNDERLYING, amount);
  const [repayState, repay] = useRepay(approvalState, amount);
  const onRepay = async () => {
    await repay();
    setVal(0);
  }

  return (
    <InteractionModal show={show} onHide={() => toggleShow(false)}>
      <>
        <InteractionModalHeader value="Repay" />
        <InteractionModalBody>
          <RiskMetrics
            changeBorrowedA={poolTokenType == PoolTokenType.BorrowableA ? -val : 0}
            changeBorrowedB={poolTokenType == PoolTokenType.BorrowableB ? -val : 0}
          />
          <InputAmount 
            val={val}
            setVal={setVal}
            suffix={symbol}
            maxTitle={'Available'}
            max={Math.min(availableBalance, borrowed)}
          />
          <Row className="interaction-row">
            <Col xs={6}>
              <InteractionButton name="Approve" onCall={onApprove} state={approvalState} />
            </Col>
            <Col xs={6}>
              <InteractionButton name="Repay" onCall={onRepay} state={repayState} />
            </Col>
          </Row>
        </InteractionModalBody>
      </>
    </InteractionModal>
  );
}