import React, { useContext, useState, useCallback, useEffect } from "react";
import { LanguageContext } from "../../contexts/Language";
import phrases from './translations';
import { Row, Col } from "react-bootstrap";
import { AccountData, PoolTokenType } from "../../impermax-router/interfaces";
import usePairAddress from "../../hooks/usePairAddress";
import { useRouterCallback, useTogglePriceInverted, usePriceInverted } from "../../hooks/useImpermaxRouter";
import { formatUSD, formatFloat, formatLeverage } from "../../utils/format";
import LiquidationPrices from "../LiquidationPrices";
import DetailsRow from "../DetailsRow";
import CurrentPrice from "../CurrentPrice";
import { useSymbol, useEquityUSD, useBalanceUSD, useDebtUSD, useCurrentLeverage } from "../../hooks/useData";


/**
 * Generates lending pool aggregate details.
 */
export default function AccountLendingPoolDetails() {
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const t = (s: string) => (phrases[s][language]);

  const equityUSD = useEquityUSD();
  const balanceUSD = useBalanceUSD();
  const debtUSD = useDebtUSD();
  const currentLeverage = useCurrentLeverage();

  return (<>
    <Row className="account-lending-pool-details">
      <Col sm={12} md={6}>
        <DetailsRow name={t("Account Equity")} value={formatUSD(equityUSD)} />
        <DetailsRow name={t("Total Balance")} value={formatUSD(balanceUSD)} />
        <DetailsRow name={t("Total Debt")} value={formatUSD(debtUSD)} />
      </Col>
      <Col sm={12} md={6}>
        <DetailsRow name={t("Current Leverage")} value={formatLeverage(currentLeverage)} />
        <DetailsRow name={t("Liquidation Prices")}>
          <LiquidationPrices />
        </DetailsRow>
        <CurrentPrice />
      </Col>
    </Row>
  </>);
}