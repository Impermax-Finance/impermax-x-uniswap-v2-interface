import React from "react";
import { Row, Col } from "react-bootstrap";
import { PoolTokenType } from "../../../impermax-router/interfaces";
import usePoolToken from "../../../hooks/usePoolToken";
import { formatPercentage } from "../../../utils/format";
import { useSupplyAPY, useNextSupplyAPY } from "../../../hooks/useData";


export default function SupplyAPY({ amount }: { amount: number }) {
  const poolTokenType = usePoolToken();
  if (poolTokenType == PoolTokenType.Collateral) return null;
  
  const supplyAPY = useNextSupplyAPY(amount)

  return (
    <Row>
      <Col xs={6}>Supply APY:</Col>
      <Col xs={6} className="text-right">{formatPercentage(supplyAPY)}</Col>
    </Row>
  );
}