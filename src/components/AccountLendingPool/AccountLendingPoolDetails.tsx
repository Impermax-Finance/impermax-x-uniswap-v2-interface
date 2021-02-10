import React, { useContext } from "react";
import { LanguageContext } from "../../contexts/Language";
import phrases from './translations';
import { Row, Col } from "react-bootstrap";
import { formatUSD } from "../../utils/format";
import DetailsRow from "../DetailsRow";
import { useSymbol, useEquityUSD, useBalanceUSD, useDebtUSD, useCurrentLeverage } from "../../hooks/useData";
import RiskMetrics from "../RiskMetrics";


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
        <RiskMetrics />
      </Col>
    </Row>
  </>);
}