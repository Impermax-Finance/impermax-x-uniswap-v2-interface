import React, { useCallback, useState, useEffect } from "react";
import { InputGroup, Button, FormControl, Row, Col } from "react-bootstrap";
import useImpermaxRouter, { useDoUpdate, useRouterUpdate, useRouterCallback } from "../../../hooks/useImpermaxRouter";
import { PoolTokenType } from "../../../impermax-router/interfaces";
import usePairAddress from "../../../hooks/usePairAddress";
import usePoolToken from "../../../hooks/usePoolToken";
import { formatFloat, formatUSD } from "../../../utils/format";


export interface TransactionSizeProps {
  amount: number;
}

export default function TransactionSize({amount}: TransactionSizeProps) {
  const poolTokenType = usePoolToken();
  if (poolTokenType != PoolTokenType.Collateral) return null;
  const uniswapV2PairAddress = usePairAddress();

  const [symbolA, setSymbolA] = useState<string>("");
  const [symbolB, setSymbolB] = useState<string>("");
  const [tokenPrices, setTokenPrices] = useState<[number, number]>([1,1]);
  useRouterCallback((router) => {
    router.getSymbol(uniswapV2PairAddress, PoolTokenType.BorrowableA).then((data) => setSymbolA(data));
    router.getSymbol(uniswapV2PairAddress, PoolTokenType.BorrowableB).then((data) => setSymbolB(data));
    router.getPriceDenomLP(uniswapV2PairAddress).then((data) => setTokenPrices(data));
  });

  return (
    <Row>
      <Col xs={6}>Transaction size:</Col>
      <Col xs={6} className="text-right">
        {formatFloat(amount / 2 / tokenPrices[0])} {symbolA}
        <br/> + 
        {formatFloat(amount / 2 / tokenPrices[1])} {symbolB}
      </Col>
    </Row>
  );
}