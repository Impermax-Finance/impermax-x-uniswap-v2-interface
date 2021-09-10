
import { useState } from 'react';
import {
  Row,
  Col,
  Button
} from 'react-bootstrap';

import InlineAccountTokenInfo from '../InlineAccountTokenInfo';
import DepositInteractionModal from 'components/InteractionModal/DepositInteractionModal';
import DisabledButtonHelper from 'components/DisabledButtonHelper';
import WithdrawInteractionModal from 'components/InteractionModal/WithdrawInteractionModal';
import { useMaxWithdrawable } from 'hooks/useData';

interface Props {
  collateralDepositedInUSD: number;
  collateralDeposited: number;
  tokenSymbol: string;
  tokenIconPath: string;
  safetyMargin: number;
  twapPrice: number;
}

const AccountLendingPoolSupplyRow = ({
  collateralDepositedInUSD,
  collateralDeposited,
  tokenSymbol,
  tokenIconPath,
  safetyMargin,
  twapPrice
}: Props): JSX.Element => {
  const [showDepositModal, toggleDepositModal] = useState(false);
  const [showWithdrawModal, toggleWithdrawModal] = useState(false);

  const maxWithdrawable = useMaxWithdrawable();
  const withdrawDisabledInfo = `You haven't supplied any ${tokenSymbol} yet.`;

  return (
    <>
      <Row className='account-lending-pool-row'>
        <Col md={3}>
          <Row className='account-lending-pool-name-icon'>
            <Col className='token-icon'>
              <img
                className='inline-block'
                src={tokenIconPath}
                alt='' />
            </Col>
            <Col className='token-name'>
              {`${tokenSymbol}`}
            </Col>
          </Row>
        </Col>
        <Col
          md={4}
          className='inline-account-token-info-container'>
          <InlineAccountTokenInfo
            name='Supplied'
            symbol={tokenSymbol}
            value={collateralDeposited}
            valueUSD={collateralDepositedInUSD} />
        </Col>
        <Col
          md={5}
          className='btn-table'>
          <Row>
            <Col>
              <Button
                variant='primary'
                onClick={() => toggleDepositModal(true)}>
                Supply
              </Button>
            </Col>
            <Col>
              {maxWithdrawable > 0 ? (
                <Button
                  variant='primary'
                  onClick={() => toggleWithdrawModal(true)}>
                  Withdraw
                </Button>
              ) : (
                <DisabledButtonHelper text={withdrawDisabledInfo}>
                  Withdraw
                </DisabledButtonHelper>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
      <DepositInteractionModal
        show={showDepositModal}
        toggleShow={toggleDepositModal}
        safetyMargin={safetyMargin}
        twapPrice={twapPrice} />
      <WithdrawInteractionModal
        show={showWithdrawModal}
        toggleShow={toggleWithdrawModal}
        safetyMargin={safetyMargin}
        twapPrice={twapPrice} />
    </>
  );
};

export default AccountLendingPoolSupplyRow;
