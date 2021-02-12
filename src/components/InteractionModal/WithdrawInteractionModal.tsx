import React, { useState } from "react";
import InteractionModal, { InteractionModalHeader, InteractionModalBody } from ".";
import { InputGroup, Button, FormControl, Row, Col } from "react-bootstrap";
import NumericalInput from "../NumericalInput";
import { PoolTokenType, ApprovalType } from "../../impermax-router/interfaces";
import usePoolToken from "../../hooks/usePoolToken";
import { formatFloat, formatUSD } from "../../utils/format";
import RiskMetrics from "../RiskMetrics";
import InputAmount from "../InputAmount";
import InteractionButton, { ButtonState } from "../InteractionButton";
import TransactionSize from "./TransactionRecap/TransactionSize";
import { decimalToBalance } from "../../utils/ether-utils";
import useApprove from "../../hooks/useApprove";
import useWithdraw from "../../hooks/useWithdraw";
import { useExchangeRate, useMaxWithdrawable, useSymbol, useDecimals, useToTokens } from "../../hooks/useData";

/**
 * Props for the withdraw interaction modal.
 * @property show Shows or hides the modal.
 * @property toggleShow A function to update the show variable to show or hide the Modal.
 */
export interface WithdrawInteractionModalProps {
  show: boolean;
  toggleShow(s: boolean): void;
}

/**
 * Styled component for the withdraw modal.
 * @param param0 any Props for component
 * @see WithdrawInteractionModalProps
 */
export default function WithdrawInteractionModal({show, toggleShow}: WithdrawInteractionModalProps) {
  const poolTokenType = usePoolToken();
  const [val, setVal] = useState<number>(0);

  const symbol = useSymbol();
  const maxWithdrawable = useMaxWithdrawable();

  const tokens = useToTokens(val);
  const [approvalState, onApprove, permitData] = useApprove(ApprovalType.POOL_TOKEN, tokens);
  const [withdrawState, withdraw] = useWithdraw(approvalState, tokens, permitData);
  const onWithdraw = async () => {
    await withdraw();
    setVal(0);
  }

  return (
    <InteractionModal show={show} onHide={() => toggleShow(false)}>
      <>
        <InteractionModalHeader value="Withdraw" />
        <InteractionModalBody>
          { poolTokenType == PoolTokenType.Collateral ? (
            <RiskMetrics changeCollateral={-val} />
          ) : (null) }
          <InputAmount 
            val={val}
            setVal={setVal}
            suffix={symbol}
            maxTitle={'Available'}
            max={maxWithdrawable}
          />
          <div className="transaction-recap">
            <TransactionSize amount={val} />
          </div>
          <Row className="interaction-row">
            <Col xs={6}>
              <InteractionButton name="Approve" onCall={onApprove} state={approvalState} />
            </Col>
            <Col xs={6}>
              <InteractionButton name="Withdraw" onCall={onWithdraw} state={withdrawState} />
            </Col>
          </Row>
        </InteractionModalBody>
      </>
    </InteractionModal>
  );
}