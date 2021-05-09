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
import DepositInteractionModal from '../InteractionModal/DepositInteractionModal';
import LeverageInteractionModal from '../InteractionModal/LeverageInteractionModal';
import WithdrawInteractionModal from '../InteractionModal/WithdrawInteractionModal';
import DeleverageInteractionModal from '../InteractionModal/DeleverageInteractionModal';
import {
  useDeposited,
  useSymbol,
  useDepositedUSD,
  useMaxDeleverage
} from '../../hooks/useData';
import { useTokenIcon } from '../../hooks/useUrlGenerator';
import DisabledButtonHelper from '../DisabledButtonHelper';

export default function AccountLendingPoolLPRow(): JSX.Element {
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const t = (s: string) => (phrases[s][language]);

  const symbol = useSymbol();
  const deposited = useDeposited();
  const depositedUSD = useDepositedUSD();
  const tokenIconA = useTokenIcon(PoolTokenType.BorrowableA);
  const tokenIconB = useTokenIcon(PoolTokenType.BorrowableB);

  const [showDepositModal, toggleDepositModal] = useState(false);
  const [showWithdrawModal, toggleWithdrawModal] = useState(false);
  const [showLeverageModal, toggleLeverageModal] = useState(false);
  const [showDeleverageModal, toggleDeleverageModal] = useState(false);

  // ray test touch <
  // const maxWithdrawable = useMaxWithdrawable();
  // ray test touch >
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
              <img src={tokenIconA} />
              <img src={tokenIconB} />
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
            name={t('Deposited')}
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
                onClick={() => toggleDepositModal(true)}>{t('Deposit')}
              </Button>
            </Col>
            <Col>
              {depositedUSD > 0 ? (
                <Button
                  variant='primary'
                  onClick={() => toggleWithdrawModal(true)}>{t('Withdraw')}
                </Button>
              ) : (
                <DisabledButtonHelper text={withdrawDisabledInfo}>{t('Withdraw')}</DisabledButtonHelper>
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              {depositedUSD > 0 ? (
                <Button
                  variant='primary'
                  onClick={() => toggleLeverageModal(true)}>{t('Leverage')}
                </Button>
              ) : (
                <DisabledButtonHelper text={leverageDisabledInfo}>{t('Leverage')}</DisabledButtonHelper>
              )}
            </Col>
            <Col>
              {maxDeleverage > 0 ? (
                <Button
                  variant='primary'
                  onClick={() => toggleDeleverageModal(true)}>{t('Deleverage')}
                </Button>
              ) : (
                <DisabledButtonHelper text={deleverageDisabledInfo}>{t('Deleverage')}</DisabledButtonHelper>
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
