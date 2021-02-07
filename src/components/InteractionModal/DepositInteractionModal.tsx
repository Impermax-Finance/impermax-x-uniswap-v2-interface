import React, { useCallback, useState, useEffect } from "react";
import InteractionModal, { InteractionModalHeader, InteractionModalBody } from ".";
import { InputGroup, Button, FormControl, Row, Col } from "react-bootstrap";
import NumericalInput from "../NumericalInput";
import { useWallet } from "use-wallet";
import useImpermaxRouter, { useDoUpdate, useRouterUpdate, useRouterCallback } from "../../hooks/useImpermaxRouter";
import { PoolTokenType, ERC20, ApprovalType } from "../../impermax-router/interfaces";
import usePairAddress from "../../hooks/usePairAddress";
import usePoolToken from "../../hooks/usePoolToken";
import { formatFloat } from "../../utils/format";
import RiskMetrics from "./RiskMetrics";
import InputAmount from "../InputAmount";
import InteractionButton, { ButtonState } from "../InteractionButton";
import TransactionSize from "./TransactionRecap/TransactionSize";
import SupplyAPY from "./TransactionRecap/SupplyAPY";
import useApprove from "../../hooks/useApprove";
import { BigNumber } from "ethers";
import { decimalToBalance } from "../../utils/ether-utils";
import useDeposit from "../../hooks/useDeposit";

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
  const [val, setVal] = useState<number>(0);

  const [symbol, setSymbol] = useState<string>("");
  const [decimals, setDecimals] = useState<number>();
  const [availableBalance, setAvailableBalance] = useState<number>(0);
  useRouterCallback((router) => {
    router.getSymbol(uniswapV2PairAddress, poolTokenType).then((data) => setSymbol(data));
    router.getDecimals(uniswapV2PairAddress, poolTokenType).then((data) => setDecimals(data));
    router.getAvailableBalance(uniswapV2PairAddress, poolTokenType).then((data) => setAvailableBalance(data));
  });

  const amount = decimalToBalance(val, decimals);
  const [approvalState, onApprove] = useApprove(ApprovalType.UNDERLYING, amount);
  const [depositState, onDeposit] = useDeposit(approvalState, amount);

  return (
    <InteractionModal show={show} onHide={() => toggleShow(false)}>
      <>
        <InteractionModalHeader value="Deposit" />
        <InteractionModalBody>
          { poolTokenType == PoolTokenType.Collateral ? (
            <RiskMetrics changeCollateral={val} />
          ) : (null) }
          <InputAmount 
            val={val}
            setVal={setVal}
            suffix={symbol}
            maxTitle={'Available'}
            max={availableBalance}
          />
          <div className="transaction-recap">
            <TransactionSize amount={val} />
            <SupplyAPY />
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
                name="Deposit" 
                onClick={depositState === ButtonState.Ready ? onDeposit : null} 
                state={depositState} 
              />
            </Col>
          </Row>
        </InteractionModalBody>
      </>
    </InteractionModal>
  );
}