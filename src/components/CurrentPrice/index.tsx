import React, { useContext, useState, useCallback, useEffect } from "react";
import { LanguageContext } from "../../contexts/Language";
import phrases from './translations';
import { Row, Col } from "react-bootstrap";
import { RiskMetrics } from "../../impermax-router/interfaces";
import { useTogglePriceInverted, usePriceInverted } from "../../hooks/useImpermaxRouter";
import { formatFloat } from "../../utils/format";
import { DetailsRowCustom } from "../DetailsRow";
import "./index.scss";

interface CurrentPriceProps {
  riskMetrics: RiskMetrics;
  symbolA: string;
  symbolB: string;
}

/**
 * Generates lending pool aggregate details.
 */
export default function CurrentPrice({ riskMetrics, symbolA, symbolB }: CurrentPriceProps) {
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const t = (s: string) => (phrases[s][language]);

  const priceInverted = usePriceInverted();
  const togglePriceInverted = useTogglePriceInverted();

  const pair = !priceInverted ? symbolA + '/' + symbolB : symbolB + '/' + symbolA;

  return (
    <DetailsRowCustom>
      <div className="name">{t("TWAP Price")} ({pair}) <i className="invert-price" onClick={() => togglePriceInverted()}></i> </div>
      <div className="value">{formatFloat(riskMetrics.TWAPPrice, 4)} (current: {formatFloat(riskMetrics.marketPrice, 4)})</div>
    </DetailsRowCustom>
  );
}