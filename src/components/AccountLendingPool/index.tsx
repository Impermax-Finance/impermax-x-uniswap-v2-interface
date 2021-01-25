import React, { useContext, useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useWallet } from 'use-wallet';
import { LanguageContext } from '../../contexts/Language';
import Button from 'react-bootstrap/Button';
import phrases from './translations';
import './index.scss';
import { Networks } from '../../utils/connections';
import { useLendingPool, Collateral, Borrowable, LendingPool } from '../../hooks/useContract';
import { BorrowableData, getBorrowableData } from '../../utils/borrowableData';
import { AccountData, getAccountData, AccountBorrowableData, AccountCollateralData } from '../../utils/accountData';
import { getIconByTokenAddress, getUniswapAddLiquidity } from '../../utils/urlGenerator';
import { formatUSD } from '../../utils/format';


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
function AccountLendingPoolDetails() {
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const t = (s: string) => (phrases[s][language]);
  return (<>
    <Row className="account-lending-pool-details">
      <Col sm={12} md={6}>
        <AccountLendingPoolDetailsRow name={t("Account Equity")} value={"$29,199"} />
        <AccountLendingPoolDetailsRow name={t("Total Balance")} value={"$29,199"} />
        <AccountLendingPoolDetailsRow name={t("Total Debt")} value={"$29,199"} />
      </Col>
      <Col sm={12} md={6}>
        <AccountLendingPoolDetailsRow name={t("Current Leverage")} value={"3.33x"} />
        <AccountLendingPoolDetailsRow name={t("Liquidation Prices")} value={"0.4785 - 0.9844"} />
        <AccountLendingPoolDetailsRow name={t("Current Price")} value={"0.6724"} />
      </Col>
    </Row>
  </>);
}



interface InlineAccountTokenInfoProps {
  name: string;
  symbol: string;
  value: number;
  valueUSD: number;
}

function InlineAccountTokenInfo({ name, symbol, value, valueUSD }: InlineAccountTokenInfoProps) {
  return (
    <Row className="inline-account-token-info">
      <Col className="name">
        {name}:
      </Col>
      <Col className="values">
        <Row>
          <Col>{value} {symbol}</Col>
        </Row>
        <Row>
          <Col>{formatUSD(valueUSD)}</Col>
        </Row>
      </Col>
    </Row>
  );
}

/**
 * Details about the liquidity pair and currency types in a tokenized liquidity position.
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
            <Button variant="primary">{t("Deposit")}</Button>
          </Col>
          <Col>
            <Button variant="primary">{t("Withdraw")}</Button>
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
    <Card>
      <Card.Body>
        { children }
      </Card.Body>
    </Card>
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