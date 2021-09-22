import { useState } from 'react';
import { InteractionModalContainer } from '.';
import { Row, Col } from 'react-bootstrap';
import { PoolTokenType, ApprovalType } from '../../types/interfaces';
import usePoolToken from '../../hooks/usePoolToken';
import RiskMetrics from '../RiskMetrics';
import InputAmount from '../InputAmount';
import InteractionButton from '../InteractionButton';
import TransactionSize from './TransactionRecap/TransactionSize';
import useApprove from '../../hooks/useApprove';
import useWithdraw from '../../hooks/useWithdraw';
import {
  useMaxWithdrawable,
  useSymbol,
  useToTokens
} from '../../hooks/useData';
import getLeverage from 'utils/helpers/get-leverage';
import getLiquidationPrices from 'utils/helpers/get-liquidation-prices';

/**
 * Props for the withdraw interaction modal.
 * @property show Shows or hides the modal.
 * @property toggleShow A function to update the show variable to show or hide the Modal.
 */
export interface WithdrawInteractionModalProps {
  show: boolean;
  toggleShow(s: boolean): void;
  safetyMargin: number;
  liquidationIncentive: number;
  twapPrice: number;
  collateralDeposited: number;
  tokenADenomLPPrice: number;
  tokenBDenomLPPrice: number;
  tokenABorrowed: number;
  tokenBBorrowed: number;
  marketPrice: number;
}

/**
 * Styled component for the withdraw modal.
 * @param param0 any Props for component
 * @see WithdrawInteractionModalProps
 */

export default function WithdrawInteractionModal({
  show,
  toggleShow,
  safetyMargin,
  liquidationIncentive,
  twapPrice,
  collateralDeposited,
  tokenADenomLPPrice,
  tokenBDenomLPPrice,
  tokenABorrowed,
  tokenBBorrowed,
  marketPrice
}: WithdrawInteractionModalProps): JSX.Element {
  const poolTokenType = usePoolToken();
  const [val, setVal] = useState<number>(0);

  const symbol = useSymbol();
  const maxWithdrawable = useMaxWithdrawable();

  const tokens = useToTokens(val);
  const invalidInput = val > maxWithdrawable;
  const [approvalState, onApprove, permitData] = useApprove(ApprovalType.POOL_TOKEN, tokens, invalidInput);
  const [withdrawState, withdraw] = useWithdraw(approvalState, tokens, invalidInput, permitData);
  const onWithdraw = async () => {
    await withdraw();
    setVal(0);
    toggleShow(false);
  };

  const changes = {
    changeCollateral: -val,
    changeBorrowedA: 0,
    changeBorrowedB: 0
  };
  const currentLiquidationPrices =
    getLiquidationPrices(
      collateralDeposited,
      tokenADenomLPPrice,
      tokenBDenomLPPrice,
      tokenABorrowed,
      tokenBBorrowed,
      twapPrice,
      safetyMargin,
      liquidationIncentive
    );
  const newLiquidationPrices =
    getLiquidationPrices(
      collateralDeposited,
      tokenADenomLPPrice,
      tokenBDenomLPPrice,
      tokenABorrowed,
      tokenBBorrowed,
      twapPrice,
      safetyMargin,
      liquidationIncentive,
      changes
    );
  const currentLeverage =
    getLeverage(
      collateralDeposited,
      tokenADenomLPPrice,
      tokenBDenomLPPrice,
      tokenABorrowed,
      tokenBBorrowed
    );
  const newLeverage =
    getLeverage(
      collateralDeposited,
      tokenADenomLPPrice,
      tokenBDenomLPPrice,
      tokenABorrowed,
      tokenBBorrowed,
      changes
    );

  return (
    <InteractionModalContainer
      title='Withdraw'
      show={show}
      toggleShow={toggleShow}>
      <>
        {poolTokenType === PoolTokenType.Collateral && (
          <RiskMetrics
            safetyMargin={safetyMargin}
            twapPrice={twapPrice}
            changes={changes}
            currentLeverage={currentLeverage}
            newLeverage={newLeverage}
            currentLiquidationPrices={currentLiquidationPrices}
            newLiquidationPrices={newLiquidationPrices}
            marketPrice={marketPrice} />
        )}
        <InputAmount
          val={val}
          setVal={setVal}
          suffix={symbol}
          maxTitle='Available'
          max={maxWithdrawable} />
        <div className='transaction-recap'>
          <TransactionSize amount={val} />
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
              name='Withdraw'
              onCall={onWithdraw}
              state={withdrawState} />
          </Col>
        </Row>
      </>
    </InteractionModalContainer>
  );
}
