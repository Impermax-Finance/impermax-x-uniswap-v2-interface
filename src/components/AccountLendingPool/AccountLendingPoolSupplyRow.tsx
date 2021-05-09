// ray test touch <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// ray test touch >

import { useContext, useState } from 'react';
import { LanguageContext } from '../../contexts/Language';
import phrases from './translations';
import { Row, Col, Button } from 'react-bootstrap';
import InlineAccountTokenInfo from './InlineAccountTokenInfo';
import DepositInteractionModal from '../InteractionModal/DepositInteractionModal';
import { useSymbol, useDeposited, useDepositedUSD, useMaxWithdrawable } from '../../hooks/useData';
import { useTokenIcon } from '../../hooks/useUrlGenerator';
import DisabledButtonHelper from '../DisabledButtonHelper';
import WithdrawInteractionModal from '../InteractionModal/WithdrawInteractionModal';

export default function AccountLendingPoolSupplyRow(): JSX.Element {
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const t = (s: string) => (phrases[s][language]);

  const symbol = useSymbol();
  const deposited = useDeposited();
  const depositedUSD = useDepositedUSD();
  const tokenIcon = useTokenIcon();

  const [showDepositModal, toggleDepositModal] = useState(false);
  const [showWithdrawModal, toggleWithdrawModal] = useState(false);

  const maxWithdrawable = useMaxWithdrawable();
  const withdrawDisabledInfo = `You haven't supplied any ${symbol} yet.`;

  return (
    <>
      <Row className='account-lending-pool-row'>
        <Col md={3}>
          <Row className='account-lending-pool-name-icon'>
            <Col className='token-icon'>
              <img
                className=''
                src={tokenIcon} />
            </Col>
            <Col className='token-name'>
              {`${symbol}`}
            </Col>
          </Row>
        </Col>
        <Col
          md={4}
          className='inline-account-token-info-container'>
          <InlineAccountTokenInfo
            name={t('Supplied')}
            symbol={symbol}
            value={deposited}
            valueUSD={depositedUSD} />
        </Col>
        <Col
          md={5}
          className='btn-table'>
          <Row>
            <Col>
              <Button
                variant='primary'
                onClick={() => toggleDepositModal(true)}>{t('Supply')}
              </Button>
            </Col>
            <Col>
              {maxWithdrawable > 0 ? (
                <Button
                  variant='primary'
                  onClick={() => toggleWithdrawModal(true)}>{t('Withdraw')}
                </Button>
              ) : (
                <DisabledButtonHelper text={withdrawDisabledInfo}>{t('Withdraw')}</DisabledButtonHelper>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
      <DepositInteractionModal
        show={showDepositModal}
        toggleShow={toggleDepositModal} />
      <WithdrawInteractionModal
        show={showWithdrawModal}
        toggleShow={toggleWithdrawModal} />
    </>
  );
}
