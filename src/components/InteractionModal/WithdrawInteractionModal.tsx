import React, { useCallback, useState, useEffect } from "react";
import InteractionModal, { InteractionModalHeader, InteractionModalBody } from ".";
import { InputGroup, Button, FormControl, Row, Col } from "react-bootstrap";
import NumericalInput from "../NumericalInput";
import { useWallet } from "use-wallet";
import useImpermaxRouter, { useDoUpdate, useRouterUpdate, useRouterCallback } from "../../hooks/useImpermaxRouter";
import { PoolTokenType } from "../../impermax-router/interfaces";
import usePairAddress from "../../hooks/usePairAddress";
import usePoolToken from "../../hooks/usePoolToken";
import { formatFloat, formatUSD } from "../../utils/format";
import RiskMetrics from "./RiskMetrics";
import InputAmount from "../InputAmount";
import InteractionButton, { ButtonStates } from "../InteractionButton";
import TransactionSize from "./TransactionRecap/TransactionSize";

/**
 * Props for the withdraw interaction modal.
 * @property show Shows or hides the modal.
 * @property toggleShow A function to update the show variable to show or hide the Modal.
 */
export interface WithdrawInteractionModalProps {
  show: boolean;
  toggleShow(s: boolean): void;
}

/**
 * Styled component for the withdraw modal.
 * @param param0 any Props for component
 * @see WithdrawInteractionModalProps
 */
export default function WithdrawInteractionModal({show, toggleShow}: WithdrawInteractionModalProps) {
  const uniswapV2PairAddress = usePairAddress();
  const poolTokenType = usePoolToken();
  const [val, setVal] = useState<string>("");

  const [symbol, setSymbol] = useState<string>("");
  const [maxWithdrawable, setMaxWithdrawable] = useState<number>(0);
  useRouterCallback((router) => {
    router.getSymbol(uniswapV2PairAddress, poolTokenType).then((data) => setSymbol(data));
    router.getMaxWithdrawable(uniswapV2PairAddress, poolTokenType).then((data) => setMaxWithdrawable(data));
  });

  const impermaxRouter = useImpermaxRouter();
  const doUpdate = useDoUpdate();
  const onDeposit = async () => {
    await impermaxRouter.withdraw(uniswapV2PairAddress, poolTokenType, val);
    doUpdate();
    toggleShow(false);
  }

  return (
    <InteractionModal show={show} onHide={() => toggleShow(false)}>
      <>
        <InteractionModalHeader value="Withdraw" />
        <InteractionModalBody>
          { poolTokenType == PoolTokenType.Collateral ? (
            <RiskMetrics changeCollateral={-1 * parseFloat(val)} />
          ) : (null) }
          <InputAmount 
            val={val}
            setVal={setVal}
            suffix={symbol}
            maxTitle={'Available'}
            max={maxWithdrawable}
          />
          <div className="transaction-recap">
            <TransactionSize amount={parseFloat(val)} />
          </div>
          <Row className="interaction-row">
            <Col xs={6}>
              <InteractionButton name="Approve" state={ButtonStates.Ready} />
            </Col>
            <Col xs={6}>
              <InteractionButton name="Withdraw" state={ButtonStates.Disabled} onClick={onDeposit} />
            </Col>
          </Row>
        </InteractionModalBody>
      </>
    </InteractionModal>
  );
}