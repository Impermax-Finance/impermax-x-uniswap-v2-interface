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
import useDeleverage from "../../hooks/useDeleverage";
import { decimalToBalance } from "../../utils/ether-utils";
import useApprove from "../../hooks/useApprove";


export interface DeleverageInteractionModalProps {
  show: boolean;
  toggleShow(s: boolean): void;
}

export default function DeleverageInteractionModal({show, toggleShow}: DeleverageInteractionModalProps) {
  const uniswapV2PairAddress = usePairAddress();
  const [val, setVal] = useState<number>(0);
  const [slippage, setSlippage] = useState<number>(2);

  const [changeAmounts, setChangeAmounts] = 
    useState<{bAmountA: number, bAmountB: number, cAmount: number, bAmountAMin: number, bAmountBMin: number}>
    ({bAmountA: 0, bAmountB: 0, cAmount: 0, bAmountAMin: 0, bAmountBMin: 0});
  const [maxDeleverage, setMaxDeleverage] = useState<number>(0);
  const [symbol, setSymbol] = useState<string>();
  const [symbolA, setSymbolA] = useState<string>();
  const [symbolB, setSymbolB] = useState<string>();
  const [borrowedA, setBorrowedA] = useState<number>();
  const [borrowedB, setBorrowedB] = useState<number>();
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [decimalsA, setDecimalsA] = useState<number>(18);
  const [decimalsB, setDecimalsB] = useState<number>(18);
  useRouterCallback((router) => {
    router.getDeleverageAmounts(uniswapV2PairAddress, val, 1 + slippage / 100).then((data) => setChangeAmounts(data));
  }, [val, slippage]);
  useRouterCallback((router) => {
    // TODO: function getMaxDeleverage which should consider that not 100% may be repayable
    router.getDeposited(uniswapV2PairAddress, PoolTokenType.Collateral).then((data) => setMaxDeleverage(data));
    router.getSymbol(uniswapV2PairAddress, PoolTokenType.Collateral).then((data) => setSymbol(data));
    router.getSymbol(uniswapV2PairAddress, PoolTokenType.BorrowableA).then((data) => setSymbolA(data));
    router.getSymbol(uniswapV2PairAddress, PoolTokenType.BorrowableB).then((data) => setSymbolB(data));
    router.getBorrowed(uniswapV2PairAddress, PoolTokenType.BorrowableA).then((data) => setBorrowedA(data));
    router.getBorrowed(uniswapV2PairAddress, PoolTokenType.BorrowableB).then((data) => setBorrowedB(data));
    router.getExchangeRate(uniswapV2PairAddress, PoolTokenType.Collateral).then((data) => setExchangeRate(data));
    router.getDecimals(uniswapV2PairAddress, PoolTokenType.BorrowableA).then((data) => setDecimalsA(data));
    router.getDecimals(uniswapV2PairAddress, PoolTokenType.BorrowableB).then((data) => setDecimalsB(data));
  });

  const tokens = decimalToBalance(val / exchangeRate, 18);
  const amountAMin = decimalToBalance(formatToDecimals(Math.max(changeAmounts.bAmountAMin, 0), decimalsA), decimalsA);
  const amountBMin = decimalToBalance(formatToDecimals(Math.max(changeAmounts.bAmountBMin, 0), decimalsB), decimalsB);
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
          <input 
            type="range" 
            className="form-range" 
            value={val} 
            step={maxDeleverage / 100} 
            min={0} 
            max={maxDeleverage} 
            onChange={(event) => setVal(parseFloat(event.target.value))} 
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
              <InteractionButton 
                name="Approve"
                onClick={approvalState === ButtonState.Ready ? onApprove : null}
                state={approvalState}
              />
            </Col>
            <Col xs={6}>
              <InteractionButton 
                name="Deleverage" 
                onClick={deleverageState === ButtonState.Ready ? onDeleverage : null} 
                state={deleverageState} 
              />
            </Col>
          </Row>
        </InteractionModalBody>
      </>
    </InteractionModal>
  );
}