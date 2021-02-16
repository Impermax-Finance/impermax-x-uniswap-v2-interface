import React from "react";
import { Row, Col } from "react-bootstrap";
import { PoolTokenType } from "../../../impermax-router/interfaces";
import usePoolToken from "../../../hooks/usePoolToken";
import { formatFloat } from "../../../utils/format";
import { useSymbol, usePriceDenomLP } from "../../../hooks/useData";


export interface TransactionSizeProps {
  amount: number;
}

export default function TransactionSize({amount}: TransactionSizeProps) {
  const poolTokenType = usePoolToken();
  if (poolTokenType != PoolTokenType.Collateral) return null;

  const symbolA = useSymbol(PoolTokenType.BorrowableA);
  const symbolB = useSymbol(PoolTokenType.BorrowableB);
  const [tokenPriceA, tokenPriceB] = usePriceDenomLP();

  return (
    <Row>
      <Col xs={6}>Transaction size:</Col>
      <Col xs={6} className="text-right">
        {formatFloat(amount / 2 / tokenPriceA)} {symbolA}
        <br/> + 
        {formatFloat(amount / 2 / tokenPriceB)} {symbolB}
      </Col>
    </Row>
  );
}