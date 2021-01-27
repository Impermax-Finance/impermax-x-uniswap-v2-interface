import React, { useContext } from "react";
import useUrlGenerator from "../../hooks/useUrlGenerator";
import { LanguageContext } from "../../contexts/Language";
import phrases from './translations';
import { Row, Col, Button, Card } from "react-bootstrap";
import { AccountCollateralData } from "../../impermax-router/interfaces";
import InlineAccountTokenInfo from "./InlineAccountTokenInfo";


interface AccountLendingPoolLPRowProps {
  accountCollateralData: AccountCollateralData;
}

/**
 * Build account lending pool detail rows for LP token currencies.
 * @params AccountLendingPoolLPRowProps
 */
export default function AccountLendingPoolLPRow({ accountCollateralData }: AccountLendingPoolLPRowProps) {
  const { getIconByTokenAddress, getUniswapAddLiquidity } = useUrlGenerator();
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const t = (s: string) => (phrases[s][language]);
  return (<>
    <Row className="account-lending-pool-row">
      <Col md={3}>
        <Row className="account-lending-pool-name-icon">
          <Col className="token-icon icon-overlapped">
            <img src={getIconByTokenAddress(accountCollateralData.tokenAAddress)} />
            <img src={getIconByTokenAddress(accountCollateralData.tokenBAddress)} />
          </Col>
          <Col className="token-name">
            { `${accountCollateralData.symbolA}-${accountCollateralData.symbolB} LP` }
          </Col>
        </Row>
      </Col>
      <Col md={4} className="inline-account-token-info-container">
        <InlineAccountTokenInfo
          name={t("Deposited")}
          symbol="LP"
          value={42.35}
          valueUSD={10204}
        />
      </Col>
      <Col md={5} className="btn-table">
        <Row>
          <Col>
            <Button variant="primary">{t("Deposit")}</Button>
          </Col>
          <Col>
            <Button variant="primary">{t("Withdraw")}</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button className="leverage" variant="primary">{t("Leverage")}</Button>
          </Col>
          <Col>
            <a 
              className="btn obtain" 
              target="_blank" 
              href={getUniswapAddLiquidity(accountCollateralData.tokenAAddress, accountCollateralData.tokenBAddress)}
            >{t("Obtain")}</a>
          </Col>
        </Row>
      </Col>
    </Row>
  </>);
}
