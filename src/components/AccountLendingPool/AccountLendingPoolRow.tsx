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
import useImpermaxRouter, { useRouterAccount } from "../../hooks/useImpermaxRouter";
import BorrowInteractionModal from "../InteractionModal/BorrowInteractionModal";

/**
 * Build account lending pool detail rows for single currencies.
 * @params AccountLendingPoolRowProps.
 */
export default function AccountLendingPoolRow() {
  const uniswapV2PairAddress = usePairAddress();
  const poolTokenType = usePoolToken();
  const { getIconByTokenAddress } = useUrlGenerator();
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const t = (s: string) => (phrases[s][language]);

  const impermaxRouter = useImpermaxRouter();
  const routerAccount = useRouterAccount();
  const [data, setData] = useState<AccountBorrowableData>();
  useEffect(() => {
    if (!impermaxRouter || !routerAccount) return;
    impermaxRouter.getAccountBorrowableData(uniswapV2PairAddress, poolTokenType).then((data) => {
      setData(data);
    });
  }, [impermaxRouter, routerAccount]);

  const [showDepositModal, toggleDepositModal] = useState(false);
  const [showBorrowModal, toggleBorrowModal] = useState(false);

  if (!data) return (<>Loading</>);

  return (<>
    <Row className="account-lending-pool-row">
      <Col md={3}>
        <Row className="account-lending-pool-name-icon">
          <Col className="token-icon">
            <img className='' src={getIconByTokenAddress(data.tokenAddress)} />
          </Col>
          <Col className="token-name">
            { `${data.symbol}` }
          </Col>
        </Row>
      </Col>
      <Col md={4} className="inline-account-token-info-container">
        <InlineAccountTokenInfo
          name={t("Deposited")}
          symbol={data.symbol}
          value={data.deposited}
          valueUSD={data.depositedUSD}
        />
        <InlineAccountTokenInfo
          name={t("Borrowed")}
          symbol={data.symbol}
          value={data.borrowed}
          valueUSD={data.borrowedUSD}
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
            <Button variant="primary" onClick={() => toggleBorrowModal(true)}>{t("Borrow")}</Button>
          </Col>
          <Col>
            <Button variant="primary">{t("Repay")}</Button>
          </Col>
        </Row>
      </Col>
    </Row>
    <DepositInteractionModal 
      show={showDepositModal} 
      toggleShow={toggleDepositModal}
    />
    <BorrowInteractionModal 
      show={showBorrowModal} 
      toggleShow={toggleBorrowModal}
    />
  </>);
}