import React from "react";
import { Row, Col } from "react-bootstrap";
import { PoolTokenType } from "../../../impermax-router/interfaces";
import usePoolToken from "../../../hooks/usePoolToken";
import { formatPercentage } from "../../../utils/format";
import { useBorrowAPY, useNextBorrowAPY } from "../../../hooks/useData";


export default function BorrowAPY({ amount }: { amount: number }) {
  const poolTokenType = usePoolToken();
  if (poolTokenType == PoolTokenType.Collateral) return null;

  const borrowAPY = useNextBorrowAPY(amount);

  return (
    <Row>
      <Col xs={6}>Borrow APY:</Col>
      <Col xs={6} className="text-right">{formatPercentage(borrowAPY)}</Col>
    </Row>
  );
}