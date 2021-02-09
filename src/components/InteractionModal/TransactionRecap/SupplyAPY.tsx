import React, { useCallback, useState, useEffect } from "react";
import { InputGroup, Button, FormControl, Row, Col } from "react-bootstrap";
import useImpermaxRouter, { useDoUpdate, useRouterUpdate, useRouterCallback } from "../../../hooks/useImpermaxRouter";
import { PoolTokenType } from "../../../impermax-router/interfaces";
import usePairAddress from "../../../hooks/usePairAddress";
import usePoolToken from "../../../hooks/usePoolToken";
import { formatFloat, formatUSD, formatPercentage } from "../../../utils/format";



export default function SupplyAPY() {
  const poolTokenType = usePoolToken();
  if (poolTokenType == PoolTokenType.Collateral) return null;
  const uniswapV2PairAddress = usePairAddress();

  const [supplyAPY, setSupplyAPY] = useState<number>(0);
  useRouterCallback((router) => {
    router.getSupplyAPY(uniswapV2PairAddress, poolTokenType).then((data) => setSupplyAPY(data));
  });

  return (
    <Row>
      <Col xs={6}>Supply APY:</Col>
      <Col xs={6} className="text-right">{formatPercentage(supplyAPY)}</Col>
    </Row>
  );
}