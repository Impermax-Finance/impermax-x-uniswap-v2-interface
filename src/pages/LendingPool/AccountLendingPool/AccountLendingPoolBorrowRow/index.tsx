
import { useState } from 'react';
import {
  Row,
  Col,
  Button
} from 'react-bootstrap';

import InlineAccountTokenInfo from '../InlineAccountTokenInfo';
import RepayInteractionModal from 'components/InteractionModal/RepayInteractionModal';
import DisabledButtonHelper from 'components/DisabledButtonHelper';
import BorrowInteractionModal from 'components/InteractionModal/BorrowInteractionModal';
import {
  useBorrowed,
  useSymbol
} from 'hooks/useData';
import { useTokenIcon } from 'hooks/useUrlGenerator';
import { PoolTokenType } from 'types/interfaces';

interface Props {
  collateralDepositedInUSD: number;
  tokenBorrowedInUSD: number;
}

const AccountLendingPoolBorrowRow = ({
  collateralDepositedInUSD,
  tokenBorrowedInUSD
}: Props): JSX.Element => {
  // ray test touch <<
  const symbol = useSymbol();
  const symbolLP = useSymbol(PoolTokenType.Collateral);
  const borrowed = useBorrowed();
  const tokenIcon = useTokenIcon();
  // ray test touch >>

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
            valueUSD={tokenBorrowedInUSD} />
        </Col>
        <Col
          md={5}
          className='btn-table'>
          <Row>
            <Col>
              {collateralDepositedInUSD > 0 ? (
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
};

export default AccountLendingPoolBorrowRow;
