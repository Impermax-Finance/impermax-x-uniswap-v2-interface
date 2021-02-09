import React, { useCallback, useState, useEffect } from "react";
import { InputGroup, Button, FormControl, Row, Col } from "react-bootstrap";
import useImpermaxRouter, { useDoUpdate, useRouterUpdate, useRouterCallback } from "../../../hooks/useImpermaxRouter";
import { PoolTokenType } from "../../../impermax-router/interfaces";
import usePairAddress from "../../../hooks/usePairAddress";
import usePoolToken from "../../../hooks/usePoolToken";
import { formatFloat, formatUSD, formatPercentage } from "../../../utils/format";



export default function BorrowAPY() {
  const poolTokenType = usePoolToken();
  if (poolTokenType == PoolTokenType.Collateral) return null;
  const uniswapV2PairAddress = usePairAddress();

  const [borrowAPY, setBorrowAPY] = useState<number>(0);
  useRouterCallback((router) => {
    router.getBorrowAPY(uniswapV2PairAddress, poolTokenType).then((data) => setBorrowAPY(data));
  });

  return (
    <Row>
      <Col xs={6}>Borrow APY:</Col>
      <Col xs={6} className="text-right">{formatPercentage(borrowAPY)}</Col>
    </Row>
  );
}