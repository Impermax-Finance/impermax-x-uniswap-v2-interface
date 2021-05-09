import { useState } from 'react';
import { InteractionModalContainer } from '.';
import { Row, Col } from 'react-bootstrap';
import { PoolTokenType, ApprovalType } from '../../impermax-router/interfaces';
import usePoolToken from '../../hooks/usePoolToken';
import RiskMetrics from '../RiskMetrics';
import InputAmount from '../InputAmount';
import InteractionButton from '../InteractionButton';
import TransactionSize from './TransactionRecap/TransactionSize';
import SupplyAPY from './TransactionRecap/SupplyAPY';
import useApprove from '../../hooks/useApprove';
import useDeposit from '../../hooks/useDeposit';
import { useSymbol, useAvailableBalance, useToBigNumber } from '../../hooks/useData';
import { useAddLiquidityUrl } from '../../hooks/useUrlGenerator';

/**
 * Props for the deposit interaction modal.
 * @property show Shows or hides the modal.
 * @property toggleShow A function to update the show variable to show or hide the Modal.
 */
export interface DepositInteractionModalProps {
  show: boolean;
  toggleShow(s: boolean): void;
}

export default function DepositInteractionModal({ show, toggleShow }: DepositInteractionModalProps): JSX.Element {
  const poolTokenType = usePoolToken();
  const [val, setVal] = useState<number>(0);

  const symbol = useSymbol();
  const availableBalance = useAvailableBalance();
  const addLiquidityUrl = useAddLiquidityUrl();

  const amount = useToBigNumber(val);
  const invalidInput = val > availableBalance;
  const [approvalState, onApprove, permitData] = useApprove(ApprovalType.UNDERLYING, amount, invalidInput);
  const [depositState, deposit] = useDeposit(approvalState, amount, invalidInput, permitData);
  const onDeposit = async () => {
    await deposit();
    setVal(0);
    toggleShow(false);
  };

  if (!availableBalance) {
    return (
      <InteractionModalContainer
        // eslint-disable-next-line eqeqeq
        title={poolTokenType == PoolTokenType.Collateral ? 'Deposit' : 'Supply'}
        show={show}
        toggleShow={toggleShow}>
        <>
          You need to hold {symbol} in your wallet in order to deposit it.
          {/* eslint-disable-next-line eqeqeq */}
          {poolTokenType == PoolTokenType.Collateral ? (
            <>
              <br />
              You can obtain it by&nbsp;
              <a
                target='_blank'
                href={addLiquidityUrl}>providing liquidity on Uniswap
              </a>
            </>
          ) : null}
        </>
      </InteractionModalContainer>
    );
  }

  return (
    <InteractionModalContainer
      // eslint-disable-next-line eqeqeq
      title={poolTokenType == PoolTokenType.Collateral ? 'Deposit' : 'Supply'}
      show={show}
      toggleShow={toggleShow}>
      <>
        {/* eslint-disable-next-line eqeqeq */}
        {poolTokenType == PoolTokenType.Collateral && (<RiskMetrics
          changeCollateral={val}
          hideIfNull={true} />)}
        <InputAmount
          val={val}
          setVal={setVal}
          suffix={symbol}
          maxTitle='Available'
          max={availableBalance} />
        <div className='transaction-recap'>
          <TransactionSize amount={val} />
          <SupplyAPY amount={val} />
        </div>
        <Row className='interaction-row'>
          <Col xs={6}>
            <InteractionButton
              name='Approve'
              onCall={onApprove}
              state={approvalState} />
          </Col>
          <Col xs={6}>
            <InteractionButton
              // eslint-disable-next-line eqeqeq
              name={poolTokenType == PoolTokenType.Collateral ? 'Deposit' : 'Supply'}
              onCall={onDeposit}
              state={depositState} />
          </Col>
        </Row>
      </>
    </InteractionModalContainer>
  );
}
