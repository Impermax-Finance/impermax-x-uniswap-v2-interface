import React, { useCallback, useState, useEffect } from "react";
import InteractionModal, { InteractionModalHeader, InteractionModalBody } from ".";
import { InputGroup, Button, FormControl, Row, Col } from "react-bootstrap";
import NumericalInput from "../NumericalInput";
import { useWallet } from "use-wallet";
import useImpermaxRouter, { useDoUpdate, useRouterUpdate, useRouterCallback } from "../../hooks/useImpermaxRouter";
import { PoolTokenType, ApprovalType } from "../../impermax-router/interfaces";
import usePairAddress from "../../hooks/usePairAddress";
import usePoolToken from "../../hooks/usePoolToken";
import RiskMetrics from "./RiskMetrics";
import InputAmount from "../InputAmount";
import InteractionButton, { ButtonState } from "../InteractionButton";
import { formatUSD } from "../../utils/format";
import { decimalToBalance } from "../../utils/ether-utils";
import useApprove from "../../hooks/useApprove";
import useRepay from "../../hooks/useRepay";

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
  const uniswapV2PairAddress = usePairAddress();
  const poolTokenType = usePoolToken();
  const [val, setVal] = useState<number>(0);

  const [symbol, setSymbol] = useState<string>("");
  const [decimals, setDecimals] = useState<number>();
  const [availableBalance, setAvailableBalance] = useState<number>(0);
  const [borrowed, setBorrowed] = useState<number>(0);
  useRouterCallback((router) => {
    router.getSymbol(uniswapV2PairAddress, poolTokenType).then((data) => setSymbol(data));
    router.getDecimals(uniswapV2PairAddress, poolTokenType).then((data) => setDecimals(data));
    router.getAvailableBalance(uniswapV2PairAddress, poolTokenType).then((data) => setAvailableBalance(data));
    router.getBorrowed(uniswapV2PairAddress, poolTokenType).then((data) => setBorrowed(data));
  });

  const amount = decimalToBalance(val, decimals);
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
              <InteractionButton 
                name="Approve"
                onClick={approvalState === ButtonState.Ready ? onApprove : null}
                state={approvalState}
              />
            </Col>
            <Col xs={6}>
              <InteractionButton 
                name="Repay" 
                onClick={repayState === ButtonState.Ready ? onRepay : null} 
                state={repayState} 
              />
            </Col>
          </Row>
        </InteractionModalBody>
      </>
    </InteractionModal>
  );
}