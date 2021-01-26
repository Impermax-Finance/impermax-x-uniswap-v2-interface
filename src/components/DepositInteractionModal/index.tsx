import InteractionModal, { InteractionModalHeader, InteractionModalBody } from "../InteractionModal";import React, { useCallback, useState } from "react";import { InputGroup, Button, FormControl, Row, Col } from "react-bootstrap";
import NumericalInput from "../NumericalInput";
import { useWallet } from "use-wallet";
import useImpermaxRouter from "../../hooks/useImpermaxRouter";

/**
 * Props for the deposit interaction modal.
 * @property show Shows or hides the modal.
 * @property toggleShow A function to update the show variable to show or hide the Modal.
 */
export interface DepositInteractionModalProps {
  show: boolean;
  toggleShow(s: boolean): void;
  symbol: string;
  tokenAddress: string;
  borrowableAddress: string;
  decimals: number;
}

/**
 * Styled component for the deposit modal.
 * @param param0 any Props for component
 * @see DepositInteractionModalProps
 */
export default function DepositInteractionModal({show, toggleShow, symbol, tokenAddress, borrowableAddress, decimals}: DepositInteractionModalProps) {
  const [val, setVal] = useState<string>("");
  const onUserInput = (input: string) => setVal(input);

  const impermaxRouter = useImpermaxRouter();

  const onDeposit = async () => {
    await impermaxRouter.deposit(tokenAddress, borrowableAddress, val, decimals);
  }

  return (
    <InteractionModal show={show} onHide={() => toggleShow(false)}>
      <>
        <InteractionModalHeader value="Deposit" />
        <InteractionModalBody>
          <div>
            New Leverage
          </div>
          <div>
            xxx -&gt; xxx
          </div>
          <div>
            New Liquidation Prices
          </div>
          <div>
            xxx -&gt; xxx
          </div>
          <div>
            Current Price
          </div>
          <div>
            xxx -&gt; xxx
          </div>
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
              <Button variant='secondary' block onClick={onDeposit}>Deposit</Button>
            </Col>
          </Row>
        </InteractionModalBody>
      </>
    </InteractionModal>
  );
}