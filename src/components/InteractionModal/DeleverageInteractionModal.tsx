import React, { useState } from "react";
import InteractionModal, { InteractionModalHeader, InteractionModalBody } from ".";
import { InputGroup, Button, FormControl, Row, Col } from "react-bootstrap";
import NumericalInput from "../NumericalInput";
import { PoolTokenType, ApprovalType } from "../../impermax-router/interfaces";
import RiskMetrics from "../RiskMetrics";
import { formatFloat, formatToDecimals } from "../../utils/format";
import InputAmount, { InputAmountMini } from "../InputAmount";
import InteractionButton, { ButtonState } from "../InteractionButton";
import useDeleverage from "../../hooks/useDeleverage";
import { decimalToBalance } from "../../utils/ether-utils";
import useApprove from "../../hooks/useApprove";
import { useSymbol, useDecimals, useDeposited, useBorrowed, useExchangeRate, useDeleverageAmounts, useToBigNumber, useToTokens } from "../../hooks/useData";


export interface DeleverageInteractionModalProps {
  show: boolean;
  toggleShow(s: boolean): void;
}

export default function DeleverageInteractionModal({show, toggleShow}: DeleverageInteractionModalProps) {
  const [val, setVal] = useState<number>(0);
  const [slippage, setSlippage] = useState<number>(2);

  const changeAmounts = useDeleverageAmounts(val, slippage);
  const maxDeleverage = useDeposited(); // TODO: function getMaxDeleverage which should consider that not 100% may be repayable
  const symbol = useSymbol(PoolTokenType.Collateral);
  const symbolA = useSymbol(PoolTokenType.BorrowableA);
  const symbolB = useSymbol(PoolTokenType.BorrowableB);
  const borrowedA = useBorrowed(PoolTokenType.BorrowableA)
  const borrowedB = useBorrowed(PoolTokenType.BorrowableB)

  const tokens = useToTokens(val);
  const amountAMin = useToBigNumber(changeAmounts.bAmountAMin, PoolTokenType.BorrowableA);
  const amountBMin = useToBigNumber(changeAmounts.bAmountBMin, PoolTokenType.BorrowableB);
  const [approvalState, onApprove, permitData] = useApprove(ApprovalType.POOL_TOKEN, tokens);
  const [deleverageState, deleverage] = useDeleverage(approvalState, tokens, amountAMin, amountBMin, permitData);
  const onDeleverage = async () => {
    await deleverage();
    setVal(0);
  }

  return (
    <InteractionModal show={show} onHide={() => toggleShow(false)}>
      <>
        <InteractionModalHeader value="Leverage" />
        <InteractionModalBody>
          <RiskMetrics changeBorrowedA={-changeAmounts.bAmountA} changeBorrowedB={-changeAmounts.bAmountB} changeCollateral={-changeAmounts.cAmount} />
          <InputAmount 
            val={val}
            setVal={setVal}
            suffix={symbol}
            maxTitle={'Available'}
            max={maxDeleverage}
          />
          <div className="transaction-recap">
            <Row>
              <Col xs={6} style={{lineHeight: '30px'}}>Max slippage:</Col>
              <Col xs={6} className="text-right"><InputAmountMini val={slippage} setVal={setSlippage} suffix={'%'} /></Col>
            </Row>
            <Row>
              <Col xs={6}>You will withdraw:</Col>
              <Col xs={6} className="text-right">{formatFloat(changeAmounts.cAmount)} {symbol}</Col>
            </Row>
            <Row>
              <Col xs={6}>You will repay at least:</Col>
              <Col xs={6} className="text-right">{formatFloat(Math.min(changeAmounts.bAmountAMin, borrowedA))} {symbolA}</Col>
            </Row>
            <Row>
              <Col xs={6}>You will repay at least:</Col>
              <Col xs={6} className="text-right">{formatFloat(Math.min(changeAmounts.bAmountBMin, borrowedB))} {symbolB}</Col>
            </Row>
            <Row>
              <Col xs={6}>You will receive at least:</Col>
              <Col xs={6} className="text-right">{formatFloat(changeAmounts.bAmountAMin > borrowedA ? changeAmounts.bAmountAMin - borrowedA : 0)} {symbolA}</Col>
            </Row>
            <Row>
              <Col xs={6}>You will receive at least:</Col>
              <Col xs={6} className="text-right">{formatFloat(changeAmounts.bAmountBMin > borrowedB ? changeAmounts.bAmountBMin - borrowedB : 0)} {symbolB}</Col>
            </Row>
          </div>
          <Row className="interaction-row">
            <Col xs={6}>
              <InteractionButton name="Approve" onCall={onApprove} state={approvalState} />
            </Col>
            <Col xs={6}>
              <InteractionButton name="Deleverage" onCall={onDeleverage} state={deleverageState} />
            </Col>
          </Row>
        </InteractionModalBody>
      </>
    </InteractionModal>
  );
}