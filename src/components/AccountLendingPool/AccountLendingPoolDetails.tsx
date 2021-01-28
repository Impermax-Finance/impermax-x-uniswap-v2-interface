import React, { useContext, useState, useCallback, useEffect } from "react";
import { LanguageContext } from "../../contexts/Language";
import phrases from './translations';
import { Row, Col } from "react-bootstrap";
import { AccountData } from "../../impermax-router/interfaces";
import usePairAddress from "../../hooks/usePairAddress";
import useImpermaxRouter from "../../hooks/useImpermaxRouter";
import { formatUSD } from "../../utils/format";


interface AccountLendingPoolDetailsRowProps {
  name: string;
  value: string;
}

/**
 * Build account lending pool detail rows for LP token currencies.
 * @params AccountLendingPoolDetailsRowProps
 */
function AccountLendingPoolDetailsRow({ name, value }: AccountLendingPoolDetailsRowProps) {
  return (
    <div className="account-lending-pool-details-row">
      <div className="name">{ name }</div>
      <div className="value">{ value }</div>
    </div>
  );
}

/**
 * Generates lending pool aggregate details.
 */
export default function AccountLendingPoolDetails() {
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const t = (s: string) => (phrases[s][language]);

  const uniswapV2PairAddress = usePairAddress();
  const [accountData, setAccountData] = useState<AccountData>();
  const impermaxRouter = useImpermaxRouter();
  useEffect(() => {
    if (!impermaxRouter) return;
    impermaxRouter.getAccountData(uniswapV2PairAddress).then((data) => setAccountData(data));
  }, [impermaxRouter]);

  if (!accountData) return (<div>
    Loading
  </div>);

  return (<>
    <Row className="account-lending-pool-details">
      <Col sm={12} md={6}>
        <AccountLendingPoolDetailsRow name={t("Account Equity")} value={formatUSD(accountData.equityUSD)} />
        <AccountLendingPoolDetailsRow name={t("Total Balance")} value={formatUSD(accountData.balanceUSD)} />
        <AccountLendingPoolDetailsRow name={t("Total Debt")} value={formatUSD(accountData.debtUSD)} />
      </Col>
      <Col sm={12} md={6}>
        <AccountLendingPoolDetailsRow name={t("Current Leverage")} value={"3.33x"} />
        <AccountLendingPoolDetailsRow name={t("Liquidation Prices")} value={"0.4785 - 0.9844"} />
        <AccountLendingPoolDetailsRow name={t("Current Price")} value={"0.6724"} />
      </Col>
    </Row>
  </>);
}