
import { useState } from 'react';
import {
  Row,
  Col,
  Button
} from 'react-bootstrap';

import InlineAccountTokenInfo from '../InlineAccountTokenInfo';
import DepositInteractionModal from 'components/InteractionModal/DepositInteractionModal';
import LeverageInteractionModal from 'components/InteractionModal/LeverageInteractionModal';
import WithdrawInteractionModal from 'components/InteractionModal/WithdrawInteractionModal';
import DeleverageInteractionModal from 'components/InteractionModal/DeleverageInteractionModal';
import DisabledButtonHelper from 'components/DisabledButtonHelper';
import {
  useSymbol,
  useMaxDeleverage
} from 'hooks/useData';
import { useTokenIcon } from 'hooks/useUrlGenerator';
import { PoolTokenType } from 'types/interfaces';

interface Props {
  collateralDepositedInUSD: number;
  collateralDeposited: number;
  tokenABorrowed: number;
  tokenBBorrowed: number;
}

const AccountLendingPoolLPRow = ({
  collateralDepositedInUSD,
  collateralDeposited,
  tokenABorrowed,
  tokenBBorrowed
}: Props): JSX.Element => {
  // ray test touch <<
  const symbol = useSymbol();
  const tokenIconA = useTokenIcon(PoolTokenType.BorrowableA);
  const tokenIconB = useTokenIcon(PoolTokenType.BorrowableB);
  // ray test touch >>

  const [showDepositModal, toggleDepositModal] = useState(false);
  const [showWithdrawModal, toggleWithdrawModal] = useState(false);
  const [showLeverageModal, toggleLeverageModal] = useState(false);
  const [showDeleverageModal, toggleDeleverageModal] = useState(false);

  const maxDeleverage = useMaxDeleverage(0);
  const withdrawDisabledInfo = `You haven't deposited any ${symbol} yet.`;
  const leverageDisabledInfo = `You need to deposit the ${symbol} LP first in order to leverage it.`;
  const deleverageDisabledInfo = `You need to open a leveraged position in order to deleverage it.`;

  return (
    <>
      <Row className='account-lending-pool-row'>
        <Col md={3}>
          <Row className='account-lending-pool-name-icon'>
            <Col className='token-icon icon-overlapped'>
              <img
                className='inline-block'
                src={tokenIconA}
                alt='' />
              <img
                className='inline-block'
                src={tokenIconB}
                alt='' />
            </Col>
            <Col className='token-name'>
              {`${symbol} LP`}
            </Col>
          </Row>
        </Col>
        <Col
          md={4}
          className='inline-account-token-info-container'>
          <InlineAccountTokenInfo
            name='Deposited'
            symbol='LP'
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
                Deposit
              </Button>
            </Col>
            <Col>
              {collateralDepositedInUSD > 0 ? (
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
          <Row>
            <Col>
              {collateralDepositedInUSD > 0 ? (
                <Button
                  variant='primary'
                  onClick={() => toggleLeverageModal(true)}>
                  Leverage
                </Button>
              ) : (
                <DisabledButtonHelper text={leverageDisabledInfo}>
                  Leverage
                </DisabledButtonHelper>
              )}
            </Col>
            <Col>
              {maxDeleverage > 0 ? (
                <Button
                  variant='primary'
                  onClick={() => toggleDeleverageModal(true)}>
                  Deleverage
                </Button>
              ) : (
                <DisabledButtonHelper text={deleverageDisabledInfo}>
                  Deleverage
                </DisabledButtonHelper>
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
      <LeverageInteractionModal
        show={showLeverageModal}
        toggleShow={toggleLeverageModal} />
      <DeleverageInteractionModal
        show={showDeleverageModal}
        toggleShow={toggleDeleverageModal}
        tokenABorrowed={tokenABorrowed}
        tokenBBorrowed={tokenBBorrowed} />
    </>
  );
};

export default AccountLendingPoolLPRow;
