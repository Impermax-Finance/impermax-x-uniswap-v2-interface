import React, { useContext } from "react";
import { LanguageContext } from "../../contexts/Language";
import phrases from './translations';
import { Row, Col } from "react-bootstrap";
import { formatUSD, formatPercentage } from "../../utils/format";
import DetailsRow from "../DetailsRow";
import { useSymbol, useEquityUSD, useBalanceUSD, useDebtUSD, useCurrentLeverage, useSuppliedUSD, useAccountAPY } from "../../hooks/useData";
import RiskMetrics from "../RiskMetrics";


/**
 * Generates lending pool aggregate details.
 */
export default function AccountLendingPoolDetailsEarnInterest() {
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const t = (s: string) => (phrases[s][language]);

  const suppliedUSD = useSuppliedUSD();
  const accountAPY = useAccountAPY();

  return (<>
    <Row className="account-lending-pool-details">
      <Col sm={12} md={6}>
        <DetailsRow name={t("Total Supplied")} value={formatUSD(suppliedUSD)} />
        <DetailsRow name={t("Supply APY")} value={formatPercentage(accountAPY)} />
      </Col>
      <Col sm={12} md={6}>
        <DetailsRow name={t("Expected monthly profit")} value={formatUSD(suppliedUSD * accountAPY / 12)} />
        <DetailsRow name={t("Expected yearly profit")} value={formatUSD(suppliedUSD * accountAPY)} />
      </Col>
    </Row>
  </>);
}