import React from "react";
import { Row, Col } from "react-bootstrap";
import { formatUSD } from "../../utils/format";


export interface InlineAccountTokenInfoProps {
  name: string;
  symbol: string;
  value: number;
  valueUSD: number;
}

export default function InlineAccountTokenInfo({ name, symbol, value, valueUSD }: InlineAccountTokenInfoProps) {
  return (
    <Row className="inline-account-token-info">
      <Col className="name">
        {name}:
      </Col>
      <Col className="values">
        <Row>
          <Col>{value} {symbol}</Col>
        </Row>
        <Row>
          <Col>{formatUSD(valueUSD)}</Col>
        </Row>
      </Col>
    </Row>
  );
}