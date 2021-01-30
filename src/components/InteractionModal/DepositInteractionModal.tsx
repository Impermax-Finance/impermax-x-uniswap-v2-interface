import React, { useCallback, useState, useEffect } from "react";
import InteractionModal, { InteractionModalHeader, InteractionModalBody } from ".";
import { InputGroup, Button, FormControl, Row, Col } from "react-bootstrap";
import NumericalInput from "../NumericalInput";
import { useWallet } from "use-wallet";
import useImpermaxRouter, { useDoUpdate, useRouterUpdate, useRouterCallback } from "../../hooks/useImpermaxRouter";
import { PoolTokenType } from "../../impermax-router/interfaces";
import usePairAddress from "../../hooks/usePairAddress";
import usePoolToken from "../../hooks/usePoolToken";
import { formatFloat } from "../../utils/format";
import RiskMetrics from "./RiskMetrics";

/**
 * Props for the deposit interaction modal.
 * @property show Shows or hides the modal.
 * @property toggleShow A function to update the show variable to show or hide the Modal.
 */
export interface DepositInteractionModalProps {
  show: boolean;
  toggleShow(s: boolean): void;
}

/**
 * Styled component for the deposit modal.
 * @param param0 any Props for component
 * @see DepositInteractionModalProps
 */
export default function DepositInteractionModal({show, toggleShow}: DepositInteractionModalProps) {
  const uniswapV2PairAddress = usePairAddress();
  const poolTokenType = usePoolToken();
  const [val, setVal] = useState<string>("");

  const [symbol, setSymbol] = useState<string>("");
  const [availableBalance, setAvailableBalance] = useState<number>(0);
  useRouterCallback((router) => {
    router.getSymbol(uniswapV2PairAddress, poolTokenType).then((symbol) => setSymbol(symbol));
    router.getAvailableBalance(uniswapV2PairAddress, poolTokenType).then((balance) => setAvailableBalance(balance));
  });

  const impermaxRouter = useImpermaxRouter();
  const doUpdate = useDoUpdate();
  const onUserInput = (input: string) => setVal(input);
  const onMax = () => setVal(availableBalance.toString());
  const onDeposit = async () => {
    await impermaxRouter.deposit(uniswapV2PairAddress, poolTokenType, val);
    doUpdate();
    toggleShow(false);
  }

  return (
    <InteractionModal show={show} onHide={() => toggleShow(false)}>
      <>
        <InteractionModalHeader value="Deposit" />
        <InteractionModalBody>
          { poolTokenType == PoolTokenType.Collateral ? (
            <RiskMetrics changeCollateral={parseFloat(val)} />
          ) : (null) }
          <div>
            Available: {formatFloat(availableBalance)} {symbol}
          </div>
          <div>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <Button variant="outline-secondary" onClick={onMax}>MAX</Button>
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
              <Button variant='secondary' block onClick={onDeposit}>Deposit</Button>
            </Col>
          </Row>
        </InteractionModalBody>
      </>
    </InteractionModal>
  );
}