// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import { useState } from 'react';
import { InteractionModalContainer } from '.';
import { Row, Col } from 'react-bootstrap';
import { PoolTokenType, ApprovalType } from '../../types/interfaces';
import RiskMetrics from '../RiskMetrics';
import { formatFloat, formatPercentage } from '../../utils/format';
import InputAmount, { InputAmountMini } from '../InputAmount';
import InteractionButton from '../InteractionButton';
import useDeleverage from '../../hooks/useDeleverage';
import useApprove from '../../hooks/useApprove';
import { useSymbol, useDeleverageAmounts, useToBigNumber, useToTokens, useMaxDeleverage, useNextBorrowAPY, useUniswapAPY, useCurrentLeverage, useNextFarmingAPY } from '../../hooks/useData';

interface DeleverageInteractionModalProps {
  show: boolean;
  toggleShow(s: boolean): void;
  tokenABorrowed: number;
  tokenBBorrowed: number;
  safetyMargin: number;
  twapPrice: number;
}

export default function DeleverageInteractionModal({
  show,
  toggleShow,
  tokenABorrowed,
  tokenBBorrowed,
  safetyMargin,
  twapPrice
}: DeleverageInteractionModalProps): JSX.Element {
  const [val, setVal] = useState<number>(0);
  const [slippage, setSlippage] = useState<number>(2);

  const changeAmounts = useDeleverageAmounts(val, slippage);
  const maxDeleverage = useMaxDeleverage(slippage);
  const symbol = useSymbol(PoolTokenType.Collateral);
  const symbolA = useSymbol(PoolTokenType.BorrowableA);
  const symbolB = useSymbol(PoolTokenType.BorrowableB);

  const tokens = useToTokens(val);
  const invalidInput = val > maxDeleverage;
  const amountAMin = useToBigNumber(changeAmounts.bAmountAMin, PoolTokenType.BorrowableA);
  const amountBMin = useToBigNumber(changeAmounts.bAmountBMin, PoolTokenType.BorrowableB);
  const [approvalState, onApprove, permitData] = useApprove(ApprovalType.POOL_TOKEN, tokens, invalidInput);
  const [deleverageState, deleverage] = useDeleverage(approvalState, invalidInput, tokens, amountAMin, amountBMin, permitData);
  const onDeleverage = async () => {
    await deleverage();
    setVal(0);
    toggleShow(false);
  };

  const changes = -changeAmounts.bAmountA || -changeAmounts.bAmountB || -changeAmounts.cAmount ? {
    changeBorrowedA: -changeAmounts.bAmountA ? -changeAmounts.bAmountA : 0,
    changeBorrowedB: -changeAmounts.bAmountB ? -changeAmounts.bAmountB : 0,
    changeCollateral: -changeAmounts.cAmount ? -changeAmounts.cAmount : 0
  } : null;
  const newLeverage = useCurrentLeverage(changes);
  const borrowAPYA = useNextBorrowAPY(-changeAmounts.bAmountA, PoolTokenType.BorrowableA);
  const borrowAPYB = useNextBorrowAPY(-changeAmounts.bAmountB, PoolTokenType.BorrowableB);
  const farmingPoolAPYA = useNextFarmingAPY(-changeAmounts.bAmountA, PoolTokenType.BorrowableA);
  const farmingPoolAPYB = useNextFarmingAPY(-changeAmounts.bAmountB, PoolTokenType.BorrowableB);
  const uniAPY = useUniswapAPY();
  const averageAPY = (borrowAPYA + borrowAPYB - farmingPoolAPYA - farmingPoolAPYB) / 2;
  const leveragedAPY = uniAPY * newLeverage - averageAPY * (newLeverage - 1);

  return (
    <InteractionModalContainer
      title='Deleverage'
      show={show}
      toggleShow={toggleShow}>
      <>
        <RiskMetrics
          changeBorrowedA={-changeAmounts.bAmountA}
          changeBorrowedB={-changeAmounts.bAmountB}
          changeCollateral={-changeAmounts.cAmount}
          safetyMargin={safetyMargin}
          twapPrice={twapPrice} />
        <InputAmount
          val={val}
          setVal={setVal}
          suffix={symbol}
          maxTitle='Available'
          max={maxDeleverage} />
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
            <Col xs={6}>You will withdraw:</Col>
            <Col
              xs={6}
              className='text-right'>{formatFloat(changeAmounts.cAmount)} {symbol}
            </Col>
          </Row>
          <Row>
            <Col xs={6}>You will repay at least:</Col>
            <Col
              xs={6}
              className='text-right'>{formatFloat(Math.min(changeAmounts.bAmountAMin, tokenABorrowed))} {symbolA}
            </Col>
          </Row>
          <Row>
            <Col xs={6}>You will repay at least:</Col>
            <Col
              xs={6}
              className='text-right'>{formatFloat(Math.min(changeAmounts.bAmountBMin, tokenBBorrowed))} {symbolB}
            </Col>
          </Row>
          <Row>
            <Col xs={6}>You will receive at least:</Col>
            <Col
              xs={6}
              className='text-right'>{formatFloat(changeAmounts.bAmountAMin > tokenABorrowed ? changeAmounts.bAmountAMin - tokenABorrowed : 0)} {symbolA}
            </Col>
          </Row>
          <Row>
            <Col xs={6}>You will receive at least:</Col>
            <Col
              xs={6}
              className='text-right'>{formatFloat(changeAmounts.bAmountBMin > tokenBBorrowed ? changeAmounts.bAmountBMin - tokenBBorrowed : 0)} {symbolB}
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
              name='Approve'
              onCall={onApprove}
              state={approvalState} />
          </Col>
          <Col xs={6}>
            <InteractionButton
              name='Deleverage'
              onCall={onDeleverage}
              state={deleverageState} />
          </Col>
        </Row>
      </>
    </InteractionModalContainer>
  );
}
