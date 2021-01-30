import React, { useContext, useState, useEffect } from "react";
import useUrlGenerator from "../../hooks/useUrlGenerator";
import { LanguageContext } from "../../contexts/Language";
import phrases from './translations';
import { Row, Col, Button, Card } from "react-bootstrap";
import { AccountCollateralData } from "../../impermax-router/interfaces";
import InlineAccountTokenInfo from "./InlineAccountTokenInfo";
import usePairAddress from "../../hooks/usePairAddress";
import { useRouterCallback } from "../../hooks/useImpermaxRouter";
import DepositInteractionModal from "../InteractionModal/DepositInteractionModal";
import LeverageInteractionModal from "../InteractionModal/LeverageInteractionModal";

/**
 * Build account lending pool detail rows for LP token currencies.
 * @params AccountLendingPoolLPRowProps
 */
export default function AccountLendingPoolLPRow() {
  const uniswapV2PairAddress = usePairAddress();
  const { getIconByTokenAddress, getUniswapAddLiquidity } = useUrlGenerator();
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const t = (s: string) => (phrases[s][language]);

  const [data, setData] = useState<AccountCollateralData>();
  useRouterCallback((router) => {
    if (!router.account) return setData(null);
    router.getAccountCollateralData(uniswapV2PairAddress).then((data) => setData(data));
  });

  const [showDepositModal, toggleDepositModal] = useState(false);
  const [showLeverageModal, toggleLeverageModal] = useState(false);

  if (!data) return (<>Loading</>);

  return (<>
    <Row className="account-lending-pool-row">
      <Col md={3}>
        <Row className="account-lending-pool-name-icon">
          <Col className="token-icon icon-overlapped">
            <img src={getIconByTokenAddress(data.tokenAAddress)} />
            <img src={getIconByTokenAddress(data.tokenBAddress)} />
          </Col>
          <Col className="token-name">
            { `${data.symbolA}-${data.symbolB} LP` }
          </Col>
        </Row>
      </Col>
      <Col md={4} className="inline-account-token-info-container">
        <InlineAccountTokenInfo
          name={t("Deposited")}
          symbol="LP"
          value={data.deposited}
          valueUSD={data.depositedUSD}
        />
      </Col>
      <Col md={5} className="btn-table">
        <Row>
          <Col>
            <Button variant="primary" onClick={() => toggleDepositModal(true)}>{t("Deposit")}</Button>
          </Col>
          <Col>
            <Button variant="primary">{t("Withdraw")}</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button className="leverage" variant="primary" onClick={() => toggleLeverageModal(true)}>{t("Leverage")}</Button>
          </Col>
          <Col>
            <a 
              className="btn obtain" 
              target="_blank" 
              href={getUniswapAddLiquidity(data.tokenAAddress, data.tokenBAddress)}
            >{t("Obtain")}</a>
          </Col>
        </Row>
      </Col>
    </Row>
    <DepositInteractionModal 
      show={showDepositModal} 
      toggleShow={toggleDepositModal}
    />
    <LeverageInteractionModal 
      show={showLeverageModal} 
      toggleShow={toggleLeverageModal}
    />
  </>);
}
