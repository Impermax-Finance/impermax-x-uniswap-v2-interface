import React, { useCallback, useState, useEffect } from "react";
import { InputGroup, Button, FormControl, Row, Col } from "react-bootstrap";
import useImpermaxRouter, { useDoUpdate, useRouterUpdate, useRouterCallback } from "../../../hooks/useImpermaxRouter";
import { PoolTokenType } from "../../../impermax-router/interfaces";
import usePairAddress from "../../../hooks/usePairAddress";
import usePoolToken from "../../../hooks/usePoolToken";
import { formatFloat, formatUSD, formatPercentage } from "../../../utils/format";

export interface BorrowFeeProps {
  amount: number;
  symbol: string;
}

export default function BorrowFee({ amount, symbol }: BorrowFeeProps) {
  return (
    <Row>
      <Col xs={6}>Borrow Fee:</Col>
      <Col xs={6} className="text-right">{formatFloat(amount / 1000)} {symbol}</Col>
    </Row>
  );
}