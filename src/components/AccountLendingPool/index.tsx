import React, { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { LanguageContext } from '../../contexts/Language';
import Button from 'react-bootstrap/Button';
import phrases from './translations';
import './index.scss';

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

/**
 * Build account lending pool detail rows for LP token currencies.
 */
function AccountLendingPoolLPRow() {
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const t = (s: string) => (phrases[s][language]);
  return (<>
    <Row>
      <Col md={4}>
      </Col>
      <Col md={4}>
      </Col>
      <Col md={4}>
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
            <Button variant="primary">{t("Leverage")}</Button>
          </Col>
          <Col>
            <Button variant="primary">{t("Obtain")}</Button>
          </Col>
        </Row>
      </Col>
    </Row>
  </>);
}

/**
 * Build account lending pool detail rows for single currencies.
 */
function AccountLendingPoolRow() {
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const t = (s: string) => (phrases[s][language]);
  return (<>
    <Row>
      <Col md={4}>
      </Col>
      <Col md={4}>
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
                <AccountLendingPoolRow />
              </Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  </div>);
}