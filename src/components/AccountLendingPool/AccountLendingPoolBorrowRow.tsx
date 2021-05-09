// ray test touch <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// ray test touch >

import { useContext, useState } from 'react';
import { LanguageContext } from '../../contexts/Language';
import phrases from './translations';
import { Row, Col, Button } from 'react-bootstrap';
import { PoolTokenType } from '../../impermax-router/interfaces';
import InlineAccountTokenInfo from './InlineAccountTokenInfo';
import RepayInteractionModal from '../InteractionModal/RepayInteractionModal';
import { useBorrowed, useSymbol, useBorrowedUSD, useDepositedUSD } from '../../hooks/useData';
import { useTokenIcon } from '../../hooks/useUrlGenerator';
import DisabledButtonHelper from '../DisabledButtonHelper';
import BorrowInteractionModal from '../InteractionModal/BorrowInteractionModal';

export default function AccountLendingPoolBorrowRow(): JSX.Element {
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const t = (s: string) => (phrases[s][language]);

  const symbol = useSymbol();
  const symbolLP = useSymbol(PoolTokenType.Collateral);
  const borrowed = useBorrowed();
  const depositedUSD = useDepositedUSD(PoolTokenType.Collateral);
  const borrowedUSD = useBorrowedUSD();
  const tokenIcon = useTokenIcon();

  const [showBorrowModal, toggleBorrowModal] = useState(false);
  const [showRepayModal, toggleRepaywModal] = useState(false);

  const borrowDisabledInfo = `You need to deposit ${symbolLP} as collateral in order to be able to borrow ${symbol}.`;
  const repayDisabledInfo = `You haven't borrowed any ${symbol} yet.`;

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
            name={t('Borrowed')}
            symbol={symbol}
            value={borrowed}
            valueUSD={borrowedUSD} />
        </Col>
        <Col
          md={5}
          className='btn-table'>
          <Row>
            <Col>
              {depositedUSD > 0 ? (
                <Button
                  variant='primary'
                  onClick={() => toggleBorrowModal(true)}>{t('Borrow')}
                </Button>
              ) : (
                <DisabledButtonHelper text={borrowDisabledInfo}>{t('Borrow')}</DisabledButtonHelper>
              )}
            </Col>
            <Col>
              {borrowed > 0 ? (
                <Button
                  variant='primary'
                  onClick={() => toggleRepaywModal(true)}>{t('Repay')}
                </Button>
              ) : (
                <DisabledButtonHelper text={repayDisabledInfo}>{t('Repay')}</DisabledButtonHelper>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
      <BorrowInteractionModal
        show={showBorrowModal}
        toggleShow={toggleBorrowModal} />
      <RepayInteractionModal
        show={showRepayModal}
        toggleShow={toggleRepaywModal} />
    </>
  );
}
