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
import { formatUSD } from "../../utils/format";

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
  const [val, setVal] = useState<string>("");
  const onUserInput = (input: string) => setVal(input);

  const [symbol, setSymbol] = useState<string>("");
  const [availableBalance, setAvailableBalance] = useState<number>(0);
  const [borrowed, setBorrowed] = useState<number>(0);
  useRouterCallback((router) => {
    router.getSymbol(uniswapV2PairAddress, poolTokenType).then((data) => setSymbol(data));
    router.getAvailableBalance(uniswapV2PairAddress, poolTokenType).then((data) => setAvailableBalance(data));
    router.getBorrowed(uniswapV2PairAddress, poolTokenType).then((data) => setBorrowed(data));
  });

  const impermaxRouter = useImpermaxRouter();
  const doUpdate = useDoUpdate();
  const onRepay = async () => {
    await impermaxRouter.repay(uniswapV2PairAddress, poolTokenType, val);
    doUpdate();
    toggleShow(false);
  }

  return (
    <InteractionModal show={show} onHide={() => toggleShow(false)}>
      <>
        <InteractionModalHeader value="Repay" />
        <InteractionModalBody>
          <RiskMetrics
            changeBorrowedA={poolTokenType == PoolTokenType.BorrowableA ? -1 * parseFloat(val) : 0}
            changeBorrowedB={poolTokenType == PoolTokenType.BorrowableB ? -1 * parseFloat(val) : 0}
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
              <InteractionButton name="Approve" state={ButtonStates.Ready} />
            </Col>
            <Col xs={6}>
              <InteractionButton name="Repay" state={ButtonStates.Disabled} onClick={onRepay} />
            </Col>
          </Row>
        </InteractionModalBody>
      </>
    </InteractionModal>
  );
}