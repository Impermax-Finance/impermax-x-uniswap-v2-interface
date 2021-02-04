import React, { useCallback, useState, useEffect } from "react";
import InteractionModal, { InteractionModalHeader, InteractionModalBody } from ".";
import { InputGroup, Button, FormControl, Row, Col } from "react-bootstrap";
import NumericalInput from "../NumericalInput";
import { useWallet } from "use-wallet";
import useImpermaxRouter, { useDoUpdate, useRouterCallback } from "../../hooks/useImpermaxRouter";
import { PoolTokenType } from "../../impermax-router/interfaces";
import usePairAddress from "../../hooks/usePairAddress";
import usePoolToken from "../../hooks/usePoolToken";
import RiskMetrics from "./RiskMetrics";
import { formatFloat, formatToDecimals } from "../../utils/format";
import InputAmount from "../InputAmount";
import InteractionButton, { ButtonStates } from "../InteractionButton";

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

  const [borrowAmounts, setBorrowAmounts] = useState<[number, number, number]>([0,0,0]);
  const [symbolA, setSymbolA] = useState<string>();
  const [symbolB, setSymbolB] = useState<string>();
  const [maxLeverage, setMaxLeverage] = useState<number>(1);
  useRouterCallback((router) => {
    router.getLeverageAmounts(uniswapV2PairAddress, val).then((data) => setBorrowAmounts(data));
  }, [val]);
  useRouterCallback((router) => {
    router.getLeverage(uniswapV2PairAddress).then((data) => setVal(Math.ceil(data * 1000) / 1000));
    router.getSymbol(uniswapV2PairAddress, PoolTokenType.BorrowableA).then((data) => setSymbolA(data));
    router.getSymbol(uniswapV2PairAddress, PoolTokenType.BorrowableB).then((data) => setSymbolB(data));
    router.getMaxLeverage(uniswapV2PairAddress).then((data) => setMaxLeverage(data));
  });

  const impermaxRouter = useImpermaxRouter();
  const doUpdate = useDoUpdate();
  const onLeverage = async () => {
    await impermaxRouter.leverage(uniswapV2PairAddress, val);
    doUpdate();
    toggleShow(false);
  }

  return (
    <InteractionModal show={show} onHide={() => toggleShow(false)}>
      <>
        <InteractionModalHeader value="Leverage" />
        <InteractionModalBody>
          <RiskMetrics changeBorrowedA={borrowAmounts[0]} changeBorrowedB={borrowAmounts[1]} changeCollateral={borrowAmounts[2]} />
          <InputAmount 
            val={val}
            setVal={setVal}
            suffix={'x'}
            maxTitle={'Max leverage'}
            max={maxLeverage}
          />
          <input type="range" className="form-range" value={val} step={0.1} min={1} max={maxLeverage} onChange={(event) => setVal(parseFloat(event.target.value))} />
          <div className="transaction-recap">
            <Row>
              <Col xs={6}>You will borrow at most</Col>
              <Col xs={6} className="text-right">{formatFloat(borrowAmounts[0])} {symbolA}</Col>
            </Row>
            <Row>
              <Col xs={6}>You will borrow at most</Col>
              <Col xs={6} className="text-right">{formatFloat(borrowAmounts[1])} {symbolB}</Col>
            </Row>
            <Row>
              <Col xs={6}>You will get at least</Col>
              <Col xs={6} className="text-right">{formatFloat(borrowAmounts[2])} {symbolA}-{symbolB}</Col>
            </Row>
          </div>
          <Row className="interaction-row">
            <Col xs={6}>
              <InteractionButton name={"Approve " + symbolA} state={ButtonStates.Ready} />
            </Col>
            <Col xs={6}>
              <InteractionButton name={"Approve " + symbolB} state={ButtonStates.Ready} />
            </Col>
          </Row>
          <Row className="interaction-row">
            <Col>
              <InteractionButton name="Leverage" state={ButtonStates.Disabled} onClick={onLeverage} />
            </Col>
          </Row>
        </InteractionModalBody>
      </>
    </InteractionModal>
  );
}