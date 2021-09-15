import { useState, useEffect } from 'react';
import { InteractionModalContainer } from '.';
import { Row, Col } from 'react-bootstrap';
import { PoolTokenType, ApprovalType } from '../../types/interfaces';
import RiskMetrics from '../RiskMetrics';
import { formatFloat, formatPercentage } from '../../utils/format';
import InputAmount, { InputAmountMini } from '../InputAmount';
import InteractionButton from '../InteractionButton';
import BorrowFee from './TransactionRecap/BorrowFee';
import useApprove from '../../hooks/useApprove';
import useLeverage from '../../hooks/useLeverage';
import {
  useSymbol,
  useDeadline,
  useMaxLeverage,
  useLeverageAmounts,
  useToBigNumber,
  useUniswapAPY,
  useNextBorrowAPY,
  useNextFarmingAPY
} from '../../hooks/useData';
import getLeverage from 'utils/helpers/get-leverage';
import getLiquidationPrices from 'utils/helpers/get-liquidation-prices';

export interface LeverageInteractionModalProps {
  show: boolean;
  toggleShow(s: boolean): void;
  safetyMargin: number;
  liquidationIncentive: number;
  twapPrice: number;
  valueCollateralWithoutChanges: number;
  valueAWithoutChanges: number;
  valueBWithoutChanges: number;
}

export default function LeverageInteractionModal({
  show,
  toggleShow,
  safetyMargin,
  liquidationIncentive,
  twapPrice,
  valueCollateralWithoutChanges,
  valueAWithoutChanges,
  valueBWithoutChanges
}: LeverageInteractionModalProps): JSX.Element {
  const [val, setVal] = useState<number>(0);
  const [slippage, setSlippage] = useState<number>(2);

  const changeAmounts = useLeverageAmounts(val, slippage);
  const maxLeverage = useMaxLeverage();
  const symbol = useSymbol();
  const symbolA = useSymbol(PoolTokenType.BorrowableA);
  const symbolB = useSymbol(PoolTokenType.BorrowableB);
  const deadline = useDeadline();

  const changes = {
    changeCollateral: changeAmounts.cAmount,
    changeBorrowedA: changeAmounts.bAmountA,
    changeBorrowedB: changeAmounts.bAmountB
  };
  const valueCollateral = valueCollateralWithoutChanges + changes.changeCollateral;
  const valueA = valueAWithoutChanges + changes.changeBorrowedA;
  const valueB = valueBWithoutChanges + changes.changeBorrowedB;
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
  const minLeverage = newLeverage;

  useEffect(() => {
    if (val === 0) setVal(Math.ceil(minLeverage * 1000) / 1000);
  }, [minLeverage]);

  const amountA = useToBigNumber(changeAmounts.bAmountA, PoolTokenType.BorrowableA);
  const amountB = useToBigNumber(changeAmounts.bAmountB, PoolTokenType.BorrowableB);
  const amountAMin = useToBigNumber(changeAmounts.bAmountAMin, PoolTokenType.BorrowableA);
  const amountBMin = useToBigNumber(changeAmounts.bAmountBMin, PoolTokenType.BorrowableB);
  const invalidInput = val < minLeverage || val > maxLeverage;
  const [approvalStateA, onApproveA, permitDataA] = useApprove(ApprovalType.BORROW, amountA, invalidInput, PoolTokenType.BorrowableA, deadline);
  const [approvalStateB, onApproveB, permitDataB] = useApprove(ApprovalType.BORROW, amountB, invalidInput, PoolTokenType.BorrowableB, deadline);
  const [leverageState, leverage] = useLeverage(approvalStateA, approvalStateB, invalidInput, amountA, amountB, amountAMin, amountBMin, permitDataA, permitDataB);
  const onLeverage = async () => {
    await leverage();
    toggleShow(false);
  };

  const borrowAPYA = useNextBorrowAPY(changeAmounts.bAmountA, PoolTokenType.BorrowableA);
  const borrowAPYB = useNextBorrowAPY(changeAmounts.bAmountB, PoolTokenType.BorrowableB);
  const farmingPoolAPYA = useNextFarmingAPY(changeAmounts.bAmountA, PoolTokenType.BorrowableA);
  const farmingPoolAPYB = useNextFarmingAPY(changeAmounts.bAmountB, PoolTokenType.BorrowableB);
  const uniAPY = useUniswapAPY() * val;
  const borrowAPY = (borrowAPYA + borrowAPYB) / 2 * (val - 1);
  const farmingPoolAPY = (farmingPoolAPYA + farmingPoolAPYB) / 2 * (val - 1);
  const leveragedAPY = uniAPY + farmingPoolAPY - borrowAPY;

  return (
    <InteractionModalContainer
      title='Leverage'
      show={show}
      toggleShow={toggleShow}>
      <>
        <RiskMetrics
          safetyMargin={safetyMargin}
          twapPrice={twapPrice}
          changes={changes}
          currentLeverage={currentLeverage}
          newLeverage={newLeverage}
          currentLiquidationPrices={currentLiquidationPrices}
          newLiquidationPrices={newLiquidationPrices} />
        <InputAmount
          val={val}
          setVal={setVal}
          suffix='x'
          maxTitle='Max leverage'
          max={maxLeverage}
          min={minLeverage} />
        <div className='transaction-recap'>
          <Row>
            <Col
              xs={6}
              style={{ lineHeight: '30px' }}>Max slippage:
            </Col>
            <Col
              xs={6}
              className='text-right'><InputAmountMini
                val={slippage}
                setVal={setSlippage}
                suffix='%' />
            </Col>
          </Row>
          <Row>
            <Col xs={6}>You will borrow at most:</Col>
            <Col
              xs={6}
              className='text-right'>{formatFloat(changeAmounts.bAmountA)} {symbolA}
            </Col>
          </Row>
          <Row>
            <Col xs={6}>You will borrow at most:</Col>
            <Col
              xs={6}
              className='text-right'>{formatFloat(changeAmounts.bAmountB)} {symbolB}
            </Col>
          </Row>
          <BorrowFee
            amount={changeAmounts.bAmountA}
            symbol={symbolA} />
          <BorrowFee
            amount={changeAmounts.bAmountB}
            symbol={symbolB} />
          <Row>
            <Col xs={6}>You will get at least:</Col>
            <Col
              xs={6}
              className='text-right'>{formatFloat(changeAmounts.cAmountMin)} {symbol}
            </Col>
          </Row>
          <Row>
            <Col xs={6}>Trading fees APY:</Col>
            <Col
              xs={6}
              className='text-right'>+{formatPercentage(uniAPY)}
            </Col>
          </Row>
          {(farmingPoolAPY > 0) && (
            <Row>
              <Col xs={6}>Farming APY:</Col>
              <Col
                xs={6}
                className='text-right'>+{formatPercentage(farmingPoolAPY)}
              </Col>
            </Row>
          )}
          <Row>
            <Col xs={6}>Borrow APY:</Col>
            <Col
              xs={6}
              className='text-right'>-{formatPercentage(borrowAPY)}
            </Col>
          </Row>
          <Row>
            <Col xs={6}>Estimated APY:</Col>
            <Col
              xs={6}
              className='text-right leveraged-apy'>{formatPercentage(leveragedAPY)}
            </Col>
          </Row>
        </div>
        <Row className='interaction-row'>
          <Col xs={6}>
            <InteractionButton
              name={'Approve ' + symbolA}
              onCall={onApproveA}
              state={approvalStateA} />
          </Col>
          <Col xs={6}>
            <InteractionButton
              name={'Approve ' + symbolB}
              onCall={onApproveB}
              state={approvalStateB} />
          </Col>
        </Row>
        <Row className='interaction-row'>
          <Col>
            <InteractionButton
              name='Leverage'
              onCall={onLeverage}
              state={leverageState} />
          </Col>
        </Row>
      </>
    </InteractionModalContainer>
  );
}
