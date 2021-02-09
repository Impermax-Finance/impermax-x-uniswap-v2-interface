import React, { useContext, useState, useEffect } from "react";
import useUrlGenerator from "../../hooks/useUrlGenerator";
import { LanguageContext } from "../../contexts/Language";
import phrases from './translations';
import { Row, Col, Button, Card } from "react-bootstrap";
import { AccountBorrowableData, PoolTokenType } from "../../impermax-router/interfaces";
import InlineAccountTokenInfo from "./InlineAccountTokenInfo";
import DepositInteractionModal from "../InteractionModal/DepositInteractionModal";
import usePoolToken from "../../hooks/usePoolToken";
import usePairAddress from "../../hooks/usePairAddress";
import useImpermaxRouter, { useRouterAccount, useRouterUpdate, useRouterCallback } from "../../hooks/useImpermaxRouter";
import BorrowInteractionModal from "../InteractionModal/BorrowInteractionModal";
import RepayInteractionModal from "../InteractionModal/RepayInteractionModal";
import WithdrawInteractionModal from "../InteractionModal/WithdrawInteractionModal";
import { useBorrowed, useUnderlyingAddress, useSymbol, useDeposited, useDepositedUSD, useBorrowedUSD } from "../../hooks/useData";

/**
 * Build account lending pool detail rows for single currencies.
 * @params AccountLendingPoolRowProps.
 */
export default function AccountLendingPoolRow() {
  const { getIconByTokenAddress } = useUrlGenerator();
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const t = (s: string) => (phrases[s][language]);

  const symbol = useSymbol();
  const tokenAddress = useUnderlyingAddress();
  const deposited = useDeposited();
  const depositedUSD = useDepositedUSD();
  const borrowed = useBorrowed();
  const borrowedUSD = useBorrowedUSD();

  const [showDepositModal, toggleDepositModal] = useState(false);
  const [showWithdrawModal, toggleWithdrawModal] = useState(false);
  const [showBorrowModal, toggleBorrowModal] = useState(false);
  const [showRepayModal, toggleRepaywModal] = useState(false);

  return (<>
    <Row className="account-lending-pool-row">
      <Col md={3}>
        <Row className="account-lending-pool-name-icon">
          <Col className="token-icon">
            <img className='' src={getIconByTokenAddress(tokenAddress)} />
          </Col>
          <Col className="token-name">
            { `${symbol}` }
          </Col>
        </Row>
      </Col>
      <Col md={4} className="inline-account-token-info-container">
        <InlineAccountTokenInfo
          name={t("Deposited")}
          symbol={symbol}
          value={deposited}
          valueUSD={depositedUSD}
        />
        <InlineAccountTokenInfo
          name={t("Borrowed")}
          symbol={symbol}
          value={borrowed}
          valueUSD={borrowedUSD}
        />
      </Col>
      <Col md={5} className="btn-table">
        <Row>
          <Col>
            <Button variant="primary" onClick={() => toggleDepositModal(true)}>{t("Deposit")}</Button>
          </Col>
          <Col>
            <Button variant="primary" onClick={() => toggleWithdrawModal(true)}>{t("Withdraw")}</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button variant="primary" onClick={() => toggleBorrowModal(true)}>{t("Borrow")}</Button>
          </Col>
          <Col>
            <Button variant="primary" onClick={() => toggleRepaywModal(true)}>{t("Repay")}</Button>
          </Col>
        </Row>
      </Col>
    </Row>
    <DepositInteractionModal 
      show={showDepositModal} 
      toggleShow={toggleDepositModal}
    />
    <WithdrawInteractionModal 
      show={showWithdrawModal} 
      toggleShow={toggleWithdrawModal}
    />
    <BorrowInteractionModal 
      show={showBorrowModal} 
      toggleShow={toggleBorrowModal}
    />
    <RepayInteractionModal 
      show={showRepayModal} 
      toggleShow={toggleRepaywModal}
    />
  </>);
}