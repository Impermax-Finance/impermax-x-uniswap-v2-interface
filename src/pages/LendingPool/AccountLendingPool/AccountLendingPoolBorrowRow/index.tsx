// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import { useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { PoolTokenType } from 'types/interfaces';
import InlineAccountTokenInfo from '../InlineAccountTokenInfo';
import RepayInteractionModal from 'components/InteractionModal/RepayInteractionModal';
import { useBorrowed, useSymbol, useBorrowedUSD, useDepositedUSD } from 'hooks/useData';
import { useTokenIcon } from 'hooks/useUrlGenerator';
import DisabledButtonHelper from 'components/DisabledButtonHelper';
import BorrowInteractionModal from 'components/InteractionModal/BorrowInteractionModal';

export default function AccountLendingPoolBorrowRow(): JSX.Element {
  const symbol = useSymbol();
  const symbolLP = useSymbol(PoolTokenType.Collateral);
  const borrowed = useBorrowed();
  const depositedUSD = useDepositedUSD(PoolTokenType.Collateral);
  const borrowedUSD = useBorrowedUSD();
  const tokenIcon = useTokenIcon();

  const [showBorrowModal, toggleBorrowModal] = useState(false);
  const [showRepayModal, toggleRepayModal] = useState(false);

  const borrowDisabledInfo = `You need to deposit ${symbolLP} as collateral in order to be able to borrow ${symbol}.`;
  const repayDisabledInfo = `You haven't borrowed any ${symbol} yet.`;

  return (
    <>
      <Row className='account-lending-pool-row'>
        <Col md={3}>
          <Row className='account-lending-pool-name-icon'>
            <Col className='token-icon'>
              <img
                className='inline-block'
                src={tokenIcon}
                alt='' />
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
            name='Borrowed'
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
                  onClick={() => toggleBorrowModal(true)}>
                  Borrow
                </Button>
              ) : (
                <DisabledButtonHelper text={borrowDisabledInfo}>
                  Borrow
                </DisabledButtonHelper>
              )}
            </Col>
            <Col>
              {borrowed > 0 ? (
                <Button
                  variant='primary'
                  onClick={() => toggleRepayModal(true)}>
                  Repay
                </Button>
              ) : (
                <DisabledButtonHelper text={repayDisabledInfo}>
                  Repay
                </DisabledButtonHelper>
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
        toggleShow={toggleRepayModal} />
    </>
  );
}
