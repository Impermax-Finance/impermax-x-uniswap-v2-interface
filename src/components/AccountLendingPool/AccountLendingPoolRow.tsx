import React, { useContext, useState } from "react";
import useUrlGenerator from "../../hooks/useUrlGenerator";
import { LanguageContext } from "../../contexts/Language";
import phrases from './translations';
import { Row, Col, Button, Card } from "react-bootstrap";
import { AccountBorrowableData } from "../../impermax-router";
import InlineAccountTokenInfo from "./InlineAccountTokenInfo";
import DepositInteractionModal from "../InteractionModal/DepositInteractionModal";


interface AccountLendingPoolRowProps {
  accountBorrowableData: AccountBorrowableData;
}

/**
 * Build account lending pool detail rows for single currencies.
 * @params AccountLendingPoolRowProps.
 */
export default function AccountLendingPoolRow({ accountBorrowableData }: AccountLendingPoolRowProps) {
  const { getIconByTokenAddress } = useUrlGenerator();
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const t = (s: string) => (phrases[s][language]);

  const [showDepositModal, toggleDepositModal] = useState(false);

  return (<>
    <Row className="account-lending-pool-row">
      <Col md={3}>
        <Row className="account-lending-pool-name-icon">
          <Col className="token-icon">
            <img className='' src={getIconByTokenAddress(accountBorrowableData.tokenAddress)} />
          </Col>
          <Col className="token-name">
            { `${accountBorrowableData.symbol}` }
          </Col>
        </Row>
      </Col>
      <Col md={4} className="inline-account-token-info-container">
        <InlineAccountTokenInfo
          name={t("Borrowed")}
          symbol={accountBorrowableData.symbol}
          value={42.35}
          valueUSD={10204}
        />
        <InlineAccountTokenInfo
          name={t("Deposited")}
          symbol={accountBorrowableData.symbol}
          value={42.35}
          valueUSD={10204}
        />
      </Col>
      <Col md={5} className="btn-table">
        <Row>
          <Col>
            <Button variant="primary">{t("Borrow")}</Button>
          </Col>
          <Col>
            <Button variant="primary">{t("Repay")}</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button variant="primary" onClick={() => toggleDepositModal(true)}>{t("Deposit")}</Button>
          </Col>
          <Col>
            <Button variant="primary">{t("Withdraw")}</Button>
          </Col>
        </Row>
      </Col>
    </Row>
    <DepositInteractionModal 
      show={showDepositModal} 
      toggleShow={toggleDepositModal}
      symbol={accountBorrowableData.symbol}
      tokenAddress={accountBorrowableData.tokenAddress}
      borrowableAddress={accountBorrowableData.borrowableAddress}
      decimals={accountBorrowableData.decimals}
    />
  </>);
}