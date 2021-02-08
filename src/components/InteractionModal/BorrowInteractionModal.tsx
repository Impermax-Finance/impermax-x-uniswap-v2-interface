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
import BorrowAPY from "./TransactionRecap/BorrowAPY";
import BorrowFee from "./TransactionRecap/BorrowFee";
import { decimalToBalance } from "../../utils/ether-utils";
import useApprove from "../../hooks/useApprove";
import useBorrow from "../../hooks/useBorrow";

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
  const uniswapV2PairAddress = usePairAddress();
  const poolTokenType = usePoolToken();
  const [val, setVal] = useState<number>(0);

  const [symbol, setSymbol] = useState<string>("");
  const [decimals, setDecimals] = useState<number>();
  const [maxBorrowable, setMaxBorrowable] = useState<number>(0);
  useRouterCallback((router) => {
    router.getSymbol(uniswapV2PairAddress, poolTokenType).then((data) => setSymbol(data));
    router.getDecimals(uniswapV2PairAddress, poolTokenType).then((data) => setDecimals(data));
    router.getMaxBorrowable(uniswapV2PairAddress, poolTokenType).then((data) => setMaxBorrowable(data));
  });

  const amount = decimalToBalance(val, decimals);
  const [approvalState, onApprove, permitData] = useApprove(ApprovalType.BORROW, amount);
  const [borrowState, borrow] = useBorrow(approvalState, amount, permitData);
  const onBorrow = async () => {
    await borrow();
    setVal(0);
  }

  return (
    <InteractionModal show={show} onHide={() => toggleShow(false)}>
      <>
        <InteractionModalHeader value="Borrow" />
        <InteractionModalBody>
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
              <InteractionButton 
                name="Approve"
                onClick={approvalState === ButtonState.Ready ? onApprove : null}
                state={approvalState}
              />
            </Col>
            <Col xs={6}>
              <InteractionButton 
                name="Borrow" 
                onClick={borrowState === ButtonState.Ready ? onBorrow : null} 
                state={borrowState} 
              />
            </Col>
          </Row>
        </InteractionModalBody>
      </>
    </InteractionModal>
  );
}