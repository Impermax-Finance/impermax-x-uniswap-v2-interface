import React, { useCallback, useState, useEffect } from "react";
import InteractionModal, { InteractionModalHeader, InteractionModalBody } from ".";
import { InputGroup, Button, FormControl, Row, Col } from "react-bootstrap";
import NumericalInput from "../NumericalInput";
import { useWallet } from "use-wallet";
import useImpermaxRouter, { useDoUpdate, useRouterCallback } from "../../hooks/useImpermaxRouter";
import { PoolTokenType, ApprovalType } from "../../impermax-router/interfaces";
import usePairAddress from "../../hooks/usePairAddress";
import usePoolToken from "../../hooks/usePoolToken";
import RiskMetrics from "./RiskMetrics";
import { formatFloat, formatToDecimals } from "../../utils/format";
import InputAmount, { InputAmountMini } from "../InputAmount";
import InteractionButton, { ButtonState } from "../InteractionButton";
import BorrowFee from "./TransactionRecap/BorrowFee";
import { decimalToBalance } from "../../utils/ether-utils";
import useApprove from "../../hooks/useApprove";
import useLeverage from "../../hooks/useLeverage";
import { BigNumber } from "ethers";

/**
 * Props for the deposit interaction modal.
 * @property show Shows or hides the modal.
 * @property toggleShow A function to update the show variable to show or hide the Modal.
 */
export interface LeverageInteractionModalProps {
  show: boolean;
  toggleShow(s: boolean): void;
}

/**
 * Styled component for the norrow modal.
 * @param param0 any Props for component
 * @see LeverageInteractionModalProps
 */
export default function LeverageInteractionModal({show, toggleShow}: LeverageInteractionModalProps) {
  const uniswapV2PairAddress = usePairAddress();
  const [val, setVal] = useState<number>(0);
  const [slippage, setSlippage] = useState<number>(2);

  const [changeAmounts, setChangeAmounts] = 
    useState<{bAmountA: number, bAmountB: number, cAmount: number, bAmountAMin: number, bAmountBMin: number, cAmountMin: number}>
    ({bAmountA: 0, bAmountB: 0, cAmount: 0, bAmountAMin: 0, bAmountBMin: 0, cAmountMin: 0});
  const [minLeverage, setMinLeverage] = useState<number>(1);
  const [maxLeverage, setMaxLeverage] = useState<number>(1);
  const [symbolA, setSymbolA] = useState<string>();
  const [symbolB, setSymbolB] = useState<string>();
  const [decimalsA, setDecimalsA] = useState<number>(18);
  const [decimalsB, setDecimalsB] = useState<number>(18);
  const [deadline, setDeadline] = useState<BigNumber>();
  useRouterCallback((router) => {
    router.getLeverageAmounts(uniswapV2PairAddress, val, 1 + slippage / 100).then((data) => setChangeAmounts(data));
  }, [val, slippage]);
  useRouterCallback((router) => {
    router.getLeverage(uniswapV2PairAddress).then((data) => {
      setVal(Math.ceil(data * 1000) / 1000);
      setMinLeverage(data);
    });
    router.getMaxLeverage(uniswapV2PairAddress).then((data) => setMaxLeverage(data));
    router.getSymbol(uniswapV2PairAddress, PoolTokenType.BorrowableA).then((data) => setSymbolA(data));
    router.getSymbol(uniswapV2PairAddress, PoolTokenType.BorrowableB).then((data) => setSymbolB(data));
    router.getDecimals(uniswapV2PairAddress, PoolTokenType.BorrowableA).then((data) => setDecimalsA(data));
    router.getDecimals(uniswapV2PairAddress, PoolTokenType.BorrowableB).then((data) => setDecimalsB(data));
    setDeadline(router.getDeadline());
  });

  const amountA = decimalToBalance(formatToDecimals(Math.max(changeAmounts.bAmountA, 0), decimalsA), decimalsA);
  const amountB = decimalToBalance(formatToDecimals(Math.max(changeAmounts.bAmountB, 0), decimalsB), decimalsB);
  const amountAMin = decimalToBalance(formatToDecimals(Math.max(changeAmounts.bAmountAMin, 0), decimalsA), decimalsA);
  const amountBMin = decimalToBalance(formatToDecimals(Math.max(changeAmounts.bAmountBMin, 0), decimalsB), decimalsB);
  const [approvalStateA, onApproveA, permitDataA] = useApprove(ApprovalType.BORROW, amountA, PoolTokenType.BorrowableA, deadline);
  const [approvalStateB, onApproveB, permitDataB] = useApprove(ApprovalType.BORROW, amountB, PoolTokenType.BorrowableB, deadline);
  const [leverageState, onLeverage] = useLeverage(approvalStateA, approvalStateB, amountA, amountB, amountAMin, amountBMin, permitDataA, permitDataB);

  return (
    <InteractionModal show={show} onHide={() => toggleShow(false)}>
      <>
        <InteractionModalHeader value="Leverage" />
        <InteractionModalBody>
          <RiskMetrics changeBorrowedA={changeAmounts.bAmountA} changeBorrowedB={changeAmounts.bAmountB} changeCollateral={changeAmounts.cAmount} />
          <InputAmount 
            val={val}
            setVal={setVal}
            suffix={'x'}
            maxTitle={'Max leverage'}
            max={maxLeverage}
          />
          <input 
            type="range" 
            className="form-range" 
            value={val} 
            step={0.1} 
            min={minLeverage - minLeverage % 0.1 + 0.1} 
            max={maxLeverage - maxLeverage % 0.1} 
            onChange={(event) => setVal(parseFloat(event.target.value))} 
          />
          <div className="transaction-recap">
            <Row>
              <Col xs={6} style={{lineHeight: '30px'}}>Max slippage:</Col>
              <Col xs={6} className="text-right"><InputAmountMini val={slippage} setVal={setSlippage} suffix={'%'} /></Col>
            </Row>
            <Row>
              <Col xs={6}>You will borrow at most:</Col>
              <Col xs={6} className="text-right">{formatFloat(changeAmounts.bAmountA)} {symbolA}</Col>
            </Row>
            <Row>
              <Col xs={6}>You will borrow at most:</Col>
              <Col xs={6} className="text-right">{formatFloat(changeAmounts.bAmountB)} {symbolB}</Col>
            </Row>
            <BorrowFee amount={changeAmounts.bAmountA} symbol={symbolA} />
            <BorrowFee amount={changeAmounts.bAmountB} symbol={symbolB} />
            <Row>
              <Col xs={6}>You will get at least:</Col>
              <Col xs={6} className="text-right">{formatFloat(changeAmounts.cAmountMin)} {symbolA}-{symbolB}</Col>
            </Row>
          </div>
          <Row className="interaction-row">
            <Col xs={6}>
              <InteractionButton 
                name={"Approve " + symbolA}
                onClick={approvalStateA === ButtonState.Ready ? onApproveA : null}
                state={approvalStateA}
              />
            </Col>
            <Col xs={6}>
              <InteractionButton 
                name={"Approve " + symbolB}
                onClick={approvalStateB === ButtonState.Ready ? onApproveB : null}
                state={approvalStateB}
              />
            </Col>
          </Row>
          <Row className="interaction-row">
            <Col>
              <InteractionButton 
                name="Leverage" 
                onClick={leverageState === ButtonState.Ready ? onLeverage : null} 
                state={leverageState} 
              />
            </Col>
          </Row>
        </InteractionModalBody>
      </>
    </InteractionModal>
  );
}