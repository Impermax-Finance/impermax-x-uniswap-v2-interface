// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import { formatLeverage } from '../../utils/format';
import DetailsRow from '../DetailsRow';
import { useCurrentLeverage } from '../../hooks/useData';
import LiquidationPrices from './LiquidationPrices';
import CurrentPrice from './CurrentPrice';
import './index.scss';

interface RiskMetricsProps {
  changeBorrowedA?: number;
  changeBorrowedB?: number;
  changeCollateral?: number;
  hideIfNull?: boolean;
}

/**
 * Generates lending pool aggregate details.
 */

export default function RiskMetrics({ changeBorrowedA, changeBorrowedB, changeCollateral, hideIfNull } : RiskMetricsProps): JSX.Element {
  const changes = changeBorrowedA || changeBorrowedB || changeCollateral ? {
    changeBorrowedA: changeBorrowedA ? changeBorrowedA : 0,
    changeBorrowedB: changeBorrowedB ? changeBorrowedB : 0,
    changeCollateral: changeCollateral ? changeCollateral : 0
  } : null;

  const currentLeverage = useCurrentLeverage();
  const newLeverage = useCurrentLeverage(changes);

  const leverageExplanation = 'Calculated as: Total Collateral / LP Equity';
  const liquidationExplanation = 'If the price crosses these boundaries, your account will become liquidatable';

  if (hideIfNull && currentLeverage === 1) return null;

  return (
    <div>
      {changes ? (
        <DetailsRow
          name='New Leverage'
          explanation={leverageExplanation}>
          {formatLeverage(currentLeverage)}
          <i className='change-arrow' />
          {formatLeverage(newLeverage)}
        </DetailsRow>
      ) : (
        <DetailsRow
          name='Current Leverage'
          explanation={leverageExplanation}>
          {formatLeverage(currentLeverage)}
        </DetailsRow>
      )}
      {changes ? (
        <DetailsRow
          name='New Liquidation Prices'
          explanation={liquidationExplanation}>
          <LiquidationPrices />
          <i className='change-arrow' />
          <LiquidationPrices changes={changes} />
        </DetailsRow>
      ) : (
        <DetailsRow
          name='Liquidation Prices'
          explanation={liquidationExplanation}>
          <LiquidationPrices />
        </DetailsRow>
      )}
      <CurrentPrice />
    </div>
  );
}
