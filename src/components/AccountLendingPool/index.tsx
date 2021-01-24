import React, { useContext, useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { useWallet } from 'use-wallet';
import { LanguageContext } from '../../contexts/Language';
import Button from 'react-bootstrap/Button';
import phrases from './translations';
import './index.scss';
import { Networks } from '../../utils/connections';
import { useLendingPool, Collateral, Borrowable, LendingPool } from '../../hooks/useContract';
import { BorrowableData, getBorrowableData } from '../../utils/borrowableData';
import { AccountData, getAccountData, AccountBorrowableData, AccountCollateralData } from '../../utils/accountData';
import { getIconByTokenAddress } from '../../utils/icons';

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
 * Details about the liquidity pair and currency types in a tokenized liquidity position.
 * @see Currency
 */
interface AccountLendingPoolLPRowProps {
  accountCollateralData: AccountCollateralData;
}

/**
 * Build account lending pool detail rows for LP token currencies.
 * @params AccountLendingPoolLPRowProps
 */
function AccountLendingPoolLPRow({ accountCollateralData }: AccountLendingPoolLPRowProps) {
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const t = (s: string) => (phrases[s][language]);
  return (<>
    <Row className="account-lending-pool-row">
      <Col md={4}>
        <img className='' src={getIconByTokenAddress(accountCollateralData.tokenAAddress)} />
        <img className='' src={getIconByTokenAddress(accountCollateralData.tokenBAddress)} />
      </Col>
      <Col md={4}>
        { `${accountCollateralData.symbolA} - ${accountCollateralData.symbolB}` }
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
            <Button className="pool-row-btn leverage" variant="primary">{t("Leverage")}</Button>
          </Col>
          <Col>
            <Button className="pool-row-btn obtain" variant="primary">{t("Obtain")}</Button>
          </Col>
        </Row>
      </Col>
    </Row>
  </>);
}

/**
 * Details about lending currency type.
 * @see Currency
 */
interface AccountLendingPoolRowProps {
  accountBorrowableData: AccountBorrowableData;
}

/**
 * Build account lending pool detail rows for single currencies.
 * @params AccountLendingPoolRowProps.
 */
function AccountLendingPoolRow({ accountBorrowableData }: AccountLendingPoolRowProps) {
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const t = (s: string) => (phrases[s][language]);
  return (<>
    <Row className="account-lending-pool-row">
      <Col md={4}>
        <img className='' src={getIconByTokenAddress(accountBorrowableData.tokenAddress)} />
      </Col>
      <Col md={4}>
        { `${accountBorrowableData.symbol}` }
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

interface AccountLendingPoolContainerProps {
  children: any;
}

function AccountLendingPoolContainer({ children }: AccountLendingPoolContainerProps) {
  return (<div className="account-lending-pool">
    <Container>
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Body>
              <Container>{ children }</Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  </div>);
}

interface AccountLendingPoolProps {
  lendingPool: LendingPool;
}

/**
 * Generate the Account Lending Pool card, giving details about the particular user's equity in the pool.
 * @params AccountLendingPoolProps
 */
export default function AccountLendingPool({ lendingPool }: AccountLendingPoolProps) {
  const { connect, account } = useWallet();
  const [accountData, setAccountData] = useState<AccountData>();

  useEffect(() => {
    if (!account || !lendingPool) return;
    getAccountData(account, lendingPool).then((result) => setAccountData(result));
  }, [account, lendingPool]);

  if (!accountData) return (
    <AccountLendingPoolContainer>
      <div className="text-center py-5">
        <Button onClick={() => {connect('injected')}}>Connect</Button>
      </div>
    </AccountLendingPoolContainer>
  );

  return (
    <AccountLendingPoolContainer>
      <AccountLendingPoolDetails />
      <AccountLendingPoolLPRow accountCollateralData={accountData.accountCollateralData}/>
      <AccountLendingPoolRow accountBorrowableData={accountData.accountBorrowableAData} />
      <AccountLendingPoolRow accountBorrowableData={accountData.accountBorrowableBData} />
    </AccountLendingPoolContainer>
  );
}