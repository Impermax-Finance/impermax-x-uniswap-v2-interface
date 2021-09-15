import { useState } from 'react';
import { InteractionModalContainer } from '.';
import { Row, Col } from 'react-bootstrap';
import { PoolTokenType, ApprovalType } from '../../types/interfaces';
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
import getLeverage from 'utils/helpers/get-leverage';
import getLiquidationPrices from 'utils/helpers/get-liquidation-prices';

/**
 * Props for the deposit interaction modal.
 * @property show Shows or hides the modal.
 * @property toggleShow A function to update the show variable to show or hide the Modal.
 */
export interface DepositInteractionModalProps {
  show: boolean;
  toggleShow(s: boolean): void;
  safetyMargin: number;
  liquidationIncentive: number;
  twapPrice: number;
  valueCollateralWithoutChanges: number;
  valueAWithoutChanges: number;
  valueBWithoutChanges: number;
}

export default function DepositInteractionModal({
  show,
  toggleShow,
  safetyMargin,
  liquidationIncentive,
  twapPrice,
  valueCollateralWithoutChanges,
  valueAWithoutChanges,
  valueBWithoutChanges
}: DepositInteractionModalProps): JSX.Element {
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
        title={poolTokenType === PoolTokenType.Collateral ? 'Deposit' : 'Supply'}
        show={show}
        toggleShow={toggleShow}>
        <>
          You need to hold {symbol} in your wallet in order to deposit it.
          {poolTokenType === PoolTokenType.Collateral ? (
            <>
              <br />
              You can obtain it by&nbsp;
              <a
                target='_blank'
                href={addLiquidityUrl}
                rel='noopener noreferrer'>
                providing liquidity on Uniswap
              </a>
            </>
          ) : null}
        </>
      </InteractionModalContainer>
    );
  }

  const changes = {
    changeCollateral: val,
    changeBorrowedA: 0,
    changeBorrowedB: 0
  };
  const valueCollateral = valueCollateralWithoutChanges + val;
  const valueA = valueAWithoutChanges + 0;
  const valueB = valueBWithoutChanges + 0;
  const currentLiquidationPrices =
    getLiquidationPrices(
      valueCollateralWithoutChanges,
      valueAWithoutChanges,
      valueBWithoutChanges,
      twapPrice,
      safetyMargin,
      liquidationIncentive
    );
  const newLiquidationPrices =
    getLiquidationPrices(
      valueCollateral,
      valueA,
      valueB,
      twapPrice,
      safetyMargin,
      liquidationIncentive
    );
  const currentLeverage = getLeverage(valueCollateral, valueA, valueB);
  const newLeverage = getLeverage(valueCollateral, valueA, valueB, changes);

  return (
    <InteractionModalContainer
      title={poolTokenType === PoolTokenType.Collateral ? 'Deposit' : 'Supply'}
      show={show}
      toggleShow={toggleShow}>
      <>
        {poolTokenType === PoolTokenType.Collateral && (
          <RiskMetrics
            hideIfNull={true}
            safetyMargin={safetyMargin}
            twapPrice={twapPrice}
            changes={changes}
            currentLeverage={currentLeverage}
            newLeverage={newLeverage}
            currentLiquidationPrices={currentLiquidationPrices}
            newLiquidationPrices={newLiquidationPrices} />
        )}
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
              name={poolTokenType === PoolTokenType.Collateral ? 'Deposit' : 'Supply'}
              onCall={onDeposit}
              state={depositState} />
          </Col>
        </Row>
      </>
    </InteractionModalContainer>
  );
}
