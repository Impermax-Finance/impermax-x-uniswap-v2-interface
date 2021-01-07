import React, { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { LanguageContext } from '../../contexts/Language';
import Button from 'react-bootstrap/Button';
import phrases from './translations';
import './index.scss';
import { Currency, ETH, DAI } from '../../utils/currency';

/**
 * Generates lending pool aggregate details.
 */
function AccountLendingPoolDetails() {
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const t = (s: string) => (phrases[s][language]);

  return (<>
    <Row>
      <Col sm={12} md={6}>
        {t("Account Equity")}
      </Col>
      <Col sm={12} md={6}>
        {t("Current Leverage")}
      </Col>
    </Row>
    <Row>
      <Col sm={12} md={6}>
        {t("Total Balance")}
      </Col>
      <Col sm={12} md={6}>
        {t("Liquidation Prices")}
      </Col>
    </Row>
    <Row>
      <Col sm={12} md={6}>
        {t("Total Debt")}
      </Col>
      <Col sm={12} md={6}>
        {t("Current Price")}
      </Col>
    </Row>
  </>);
}


interface AccountLendingPoolLPRowProps {
  currency1: Currency;
  currency2: Currency;
}

/**
 * Build account lending pool detail rows for LP token currencies.
 */
function AccountLendingPoolLPRow({ currency1, currency2 }: AccountLendingPoolLPRowProps) {
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const t = (s: string) => (phrases[s][language]);
  return (<>
    <Row className="account-lending-pool-row">
      <Col md={4}>
        <img className='' src={currency1.icon} />
        <img className='' src={currency2.icon} />
      </Col>
      <Col md={4}>
        { `${currency1.fullName} - ${currency2.fullName}` }
      </Col>
      <Col md={4}>
        <Row>
          <Col>
            <Button className="pool-row-btn" variant="primary">{t("Deposit")}</Button>
          </Col>
          <Col>
            <Button className="pool-row-btn" variant="primary">{t("Withdraw")}</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button className="pool-row-btn" variant="primary">{t("Leverage")}</Button>
          </Col>
          <Col>
            <Button className="pool-row-btn" variant="primary">{t("Obtain")}</Button>
          </Col>
        </Row>
      </Col>
    </Row>
  </>);
}

interface AccountLendingPoolRowProps {
  currency: Currency;
}

/**
 * Build account lending pool detail rows for single currencies.
 */
function AccountLendingPoolRow({ currency }: AccountLendingPoolRowProps) {
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const t = (s: string) => (phrases[s][language]);
  return (<>
    <Row className="account-lending-pool-row">
      <Col md={4}>
        <img className='' src={currency.icon} />
      </Col>
      <Col md={4}>
        { `${currency.fullName}` }
      </Col>
      <Col md={4}>
        <Row>
          <Col>
            <Button className="pool-row-btn" variant="primary">{t("Borrow")}</Button>
          </Col>
          <Col>
            <Button className="pool-row-btn" variant="primary">{t("Repay")}</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button className="pool-row-btn" variant="primary">{t("Deposit")}</Button>
          </Col>
          <Col>
            <Button className="pool-row-btn" variant="primary">{t("Withdraw")}</Button>
          </Col>
        </Row>
      </Col>
    </Row>
  </>);
}

/**
 * Generate the Account Lending Pool card, giving details about the particular user's equity in the pool.
 */
export default function AccountLendingPool() {
  return (<div className="account-lending-pool">
    <Container>
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Body>
              <Container>
                <AccountLendingPoolDetails />
                <AccountLendingPoolLPRow currency1={ETH} currency2={DAI}/>
                <AccountLendingPoolRow currency={ETH} />
                <AccountLendingPoolRow currency={DAI} />
              </Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  </div>);
}