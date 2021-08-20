// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import { useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { PoolTokenType } from '../../../types/interfaces';
import InlineAccountTokenInfo from './InlineAccountTokenInfo';
import DepositInteractionModal from '../../../components/InteractionModal/DepositInteractionModal';
import LeverageInteractionModal from '../../../components/InteractionModal/LeverageInteractionModal';
import WithdrawInteractionModal from '../../../components/InteractionModal/WithdrawInteractionModal';
import DeleverageInteractionModal from '../../../components/InteractionModal/DeleverageInteractionModal';
import {
  useDeposited,
  useSymbol,
  useDepositedUSD,
  useMaxDeleverage
} from '../../../hooks/useData';
import { useTokenIcon } from '../../../hooks/useUrlGenerator';
import DisabledButtonHelper from '../../../components/DisabledButtonHelper';

export default function AccountLendingPoolLPRow(): JSX.Element {
  const symbol = useSymbol();
  const deposited = useDeposited();
  const depositedUSD = useDepositedUSD();
  const tokenIconA = useTokenIcon(PoolTokenType.BorrowableA);
  const tokenIconB = useTokenIcon(PoolTokenType.BorrowableB);

  const [showDepositModal, toggleDepositModal] = useState(false);
  const [showWithdrawModal, toggleWithdrawModal] = useState(false);
  const [showLeverageModal, toggleLeverageModal] = useState(false);
  const [showDeleverageModal, toggleDeleverageModal] = useState(false);

  // TODO: <
  // const maxWithdrawable = useMaxWithdrawable();
  // TODO: >
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
                onClick={() => toggleDepositModal(true)}>
                Deposit
              </Button>
            </Col>
            <Col>
              {depositedUSD > 0 ? (
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
              {depositedUSD > 0 ? (
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
        toggleShow={toggleDeleverageModal} />
    </>
  );
}
