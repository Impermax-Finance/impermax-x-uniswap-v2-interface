import React, { useContext, useState, useEffect } from "react";
import useUrlGenerator from "../../hooks/useUrlGenerator";
import { LanguageContext } from "../../contexts/Language";
import phrases from './translations';
import { Row, Col, Button, Card } from "react-bootstrap";
import { AccountCollateralData, PoolTokenType } from "../../impermax-router/interfaces";
import InlineAccountTokenInfo from "./InlineAccountTokenInfo";
import usePairAddress from "../../hooks/usePairAddress";
import { useRouterCallback } from "../../hooks/useImpermaxRouter";
import DepositInteractionModal from "../InteractionModal/DepositInteractionModal";
import LeverageInteractionModal from "../InteractionModal/LeverageInteractionModal";
import WithdrawInteractionModal from "../InteractionModal/WithdrawInteractionModal";
import DeleverageInteractionModal from "../InteractionModal/DeleverageInteractionModal";
import { useUnderlyingAddress, useDeposited, useSymbol, useDepositedUSD } from "../../hooks/useData";

/**
 * Build account lending pool detail rows for LP token currencies.
 * @params AccountLendingPoolLPRowProps
 */
export default function AccountLendingPoolLPRow() {
  const { getIconByTokenAddress, getUniswapAddLiquidity } = useUrlGenerator();
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const t = (s: string) => (phrases[s][language]);

  const symbolA = useSymbol(PoolTokenType.BorrowableA);
  const symbolB = useSymbol(PoolTokenType.BorrowableB);
  const tokenAAddress = useUnderlyingAddress(PoolTokenType.BorrowableA);
  const tokenBAddress = useUnderlyingAddress(PoolTokenType.BorrowableB);
  const deposited = useDeposited();
  const depositedUSD = useDepositedUSD();

  const [showDepositModal, toggleDepositModal] = useState(false);
  const [showWithdrawModal, toggleWithdrawModal] = useState(false);
  const [showLeverageModal, toggleLeverageModal] = useState(false);
  const [showDeleverageModal, toggleDeleverageModal] = useState(false);

  return (<>
    <Row className="account-lending-pool-row">
      <Col md={3}>
        <Row className="account-lending-pool-name-icon">
          <Col className="token-icon icon-overlapped">
            <img src={getIconByTokenAddress(tokenAAddress)} />
            <img src={getIconByTokenAddress(tokenBAddress)} />
          </Col>
          <Col className="token-name">
            { `${symbolA}-${symbolB} LP` }
          </Col>
        </Row>
      </Col>
      <Col md={4} className="inline-account-token-info-container">
        <InlineAccountTokenInfo
          name={t("Deposited")}
          symbol="LP"
          value={deposited}
          valueUSD={depositedUSD}
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
            <Button className="leverage" variant="primary" onClick={() => toggleLeverageModal(true)}>{t("Leverage")}</Button>
          </Col>
          <Col>
            <Button variant="primary" onClick={() => toggleDeleverageModal(true)}>{t("Deleverage")}</Button>
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
    <LeverageInteractionModal 
      show={showLeverageModal} 
      toggleShow={toggleLeverageModal}
    />
    <DeleverageInteractionModal 
      show={showDeleverageModal} 
      toggleShow={toggleDeleverageModal}
    />
  </>);
}
