import React, { useContext, useState, useCallback, useEffect } from "react";
import { LanguageContext } from "../../contexts/Language";
import phrases from './translations';
import { Row, Col } from "react-bootstrap";
import { AccountData, RiskMetrics, PoolTokenType } from "../../impermax-router/interfaces";
import usePairAddress from "../../hooks/usePairAddress";
import useImpermaxRouter, { useRouterAccount, useRouterUpdate, useDoUpdate, useRouterCallback } from "../../hooks/useImpermaxRouter";
import { formatUSD, formatFloat, formatLeverage } from "../../utils/format";
import LiquidationPrices from "../LiquidationPrices";
import DetailsRow from "../DetailsRow";

interface RiskMetricsProps {
  changeBorrowedA?: number;
  changeBorrowedB?: number;
  changeCollateral?: number;
}

/**
 * Generates lending pool aggregate details.
 */
export default function RiskMetrics({changeBorrowedA, changeBorrowedB, changeCollateral} : RiskMetricsProps) {
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const t = (s: string) => (phrases[s][language]);

  const uniswapV2PairAddress = usePairAddress();
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics>();
  const [newRiskMetrics, setNewRiskMetrics] = useState<RiskMetrics>();
  const [symbolA, setSymbolA] = useState<string>();
  const [symbolB, setSymbolB] = useState<string>();

  useRouterCallback((router) => {
    router.getSymbol(uniswapV2PairAddress, PoolTokenType.BorrowableA).then((data) => setSymbolA(data));
    router.getSymbol(uniswapV2PairAddress, PoolTokenType.BorrowableB).then((data) => setSymbolB(data));
    router.getRiskMetrics(uniswapV2PairAddress).then((data) => setRiskMetrics(data));
  });
  useRouterCallback((router) => {
    router.getNewRiskMetrics(
      uniswapV2PairAddress,
      changeBorrowedA ? changeBorrowedA : 0,
      changeBorrowedB ? changeBorrowedB : 0,
      changeCollateral ? changeCollateral : 0,
    ).then((data) => setNewRiskMetrics(data));
   }, [changeBorrowedA, changeBorrowedB, changeCollateral]);

  if (!riskMetrics || !newRiskMetrics) return null;
  return (<div>
    <DetailsRow name={t("New Leverage")} value={formatLeverage(riskMetrics.leverage) + ' -> ' + formatLeverage(newRiskMetrics.leverage)} />
    <DetailsRow name={t("New Liquidation Prices")}>
      <LiquidationPrices riskMetrics={riskMetrics}></LiquidationPrices> -> <LiquidationPrices riskMetrics={newRiskMetrics}></LiquidationPrices>
    </DetailsRow>
    <DetailsRow 
      name={t("TWAP Price") + ' (' + symbolA + '/' + symbolB + ')'} 
      value={formatFloat(riskMetrics.TWAPPrice, 4)+' (current: '+formatFloat(riskMetrics.marketPrice, 4)+')'} 
    />
  </div>);
}