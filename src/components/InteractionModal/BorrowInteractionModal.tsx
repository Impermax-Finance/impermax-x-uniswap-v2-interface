import React, { useCallback, useState, useEffect } from "react";
import InteractionModal, { InteractionModalHeader, InteractionModalBody } from ".";
import { InputGroup, Button, FormControl, Row, Col } from "react-bootstrap";
import NumericalInput from "../NumericalInput";
import { useWallet } from "use-wallet";
import useImpermaxRouter, { useDoUpdate, useRouterUpdate, useRouterCallback } from "../../hooks/useImpermaxRouter";
import { PoolTokenType } from "../../impermax-router/interfaces";
import usePairAddress from "../../hooks/usePairAddress";
import usePoolToken from "../../hooks/usePoolToken";
import RiskMetrics from "./RiskMetrics";
import InputAmount from "../InputAmount";
import InteractionButton, { ButtonStates } from "../InteractionButton";
import BorrowAPY from "./TransactionRecap/BorrowAPY";
import BorrowFee from "./TransactionRecap/BorrowFee";

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
  const [maxBorrowable, setMaxBorrowable] = useState<number>(0);
  useRouterCallback((router) => {
    router.getSymbol(uniswapV2PairAddress, poolTokenType).then((data) => setSymbol(data));
    router.getMaxBorrowable(uniswapV2PairAddress, poolTokenType).then((data) => setMaxBorrowable(data));
  });

  const impermaxRouter = useImpermaxRouter();
  const doUpdate = useDoUpdate();
  const onBorrow = async () => {
    await impermaxRouter.borrow(uniswapV2PairAddress, poolTokenType, val);
    doUpdate();
    toggleShow(false);
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
            <BorrowFee amount={val} />
            <BorrowAPY />
          </div>
          <Row className="interaction-row">
            <Col xs={6}>
              <InteractionButton name="Approve" state={ButtonStates.Ready} />
            </Col>
            <Col xs={6}>
              <InteractionButton name="Borrow" state={ButtonStates.Disabled} onClick={onBorrow} />
            </Col>
          </Row>
        </InteractionModalBody>
      </>
    </InteractionModal>
  );
}