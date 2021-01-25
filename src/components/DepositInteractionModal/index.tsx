import InteractionModal, { InteractionModalHeader, InteractionModalBody } from "../InteractionModal";import React from "react";import { InputGroup, Button, FormControl, Row, Col } from "react-bootstrap";

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
  return (
    <InteractionModal show={show} onHide={() => toggleShow(false)}>
      <>
        <InteractionModalHeader value="Deposit" />
        <InteractionModalBody>
          <div>
            New Leverage
          </div>
          <div>
            xxx -> xxx
          </div>
          <div>
            New Liquidation Prices
          </div>
          <div>
            xxx -> xxx
          </div>
          <div>
            Current Price
          </div>
          <div>
            xxx -> xxx
          </div>
          <div>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <Button variant="outline-secondary">MAX</Button>
              </InputGroup.Prepend>
              <FormControl aria-describedby="basic-addon1" />
              <InputGroup.Append>
                <InputGroup.Text>ETH</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </div>
          <Row>
            <Col xs={6}>
              <Button variant="success" block>Approve</Button>
            </Col>
            <Col xs={6}>
              <Button variant='secondary' block>Deposit</Button>
            </Col>
          </Row>
        </InteractionModalBody>
      </>
    </InteractionModal>
  );
}