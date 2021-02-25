import React, { useContext, useState, useCallback, useEffect } from "react";
import { LanguageContext } from "../../contexts/Language";
import phrases from './translations';
import { Row, Col } from "react-bootstrap";
import { PoolTokenType } from "../../impermax-router/interfaces";
import { useTogglePriceInverted, usePriceInverted } from "../../hooks/useImpermaxRouter";
import { formatFloat } from "../../utils/format";
import { DetailsRowCustom } from "../DetailsRow";
import { useSymbol, useTWAPPrice, useMarketPrice } from "../../hooks/useData";
import QuestionHelper from "../QuestionHelper";


/**
 * Generates lending pool aggregate details.
 */
export default function CurrentPrice() {
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const t = (s: string) => (phrases[s][language]);

  const TWAPPrice = useTWAPPrice();
  const marketPrice = useMarketPrice();

  const priceInverted = usePriceInverted();
  const togglePriceInverted = useTogglePriceInverted();
  const symbolA = useSymbol(PoolTokenType.BorrowableA);
  const symbolB = useSymbol(PoolTokenType.BorrowableB);
  const pair = !priceInverted ? symbolA + '/' + symbolB : symbolB + '/' + symbolA;

  return (
    <DetailsRowCustom>
      <div className="name">{t("TWAP Price")} ({pair}) <QuestionHelper text={"The TWAP (Time Weighted Average Price) and the current market price on Uniswap"} /></div>
      <div className="value">{formatFloat(TWAPPrice, 4)} (current: {formatFloat(marketPrice, 4)}) <i className="invert-price" onClick={() => togglePriceInverted()}></i></div>
    </DetailsRowCustom>
  );
}