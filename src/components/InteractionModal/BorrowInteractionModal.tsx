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
  const [val, setVal] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const onUserInput = (input: string) => setVal(input);

  useRouterCallback((router) => {
    router.getSymbol(uniswapV2PairAddress, poolTokenType).then((symbol) => setSymbol(symbol));
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
            changeBorrowedA={poolTokenType == PoolTokenType.BorrowableA ? parseFloat(val) : 0}
            changeBorrowedB={poolTokenType == PoolTokenType.BorrowableB ? parseFloat(val) : 0}
          />
          <div>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <Button variant="outline-secondary">MAX</Button>
              </InputGroup.Prepend>
              <NumericalInput value={val} onUserInput={input => {onUserInput(input)}} />
              <InputGroup.Append>
                <InputGroup.Text>{symbol}</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </div>
          <Row>
            <Col xs={6}>
              <Button variant="success" block>Approve</Button>
            </Col>
            <Col xs={6}>
              <Button variant='secondary' block onClick={onBorrow}>Borrow</Button>
            </Col>
          </Row>
        </InteractionModalBody>
      </>
    </InteractionModal>
  );
}