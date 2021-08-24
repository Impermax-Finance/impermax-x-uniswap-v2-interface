
import DetailsRow from '../DetailsRow';
import LiquidationPrices from './LiquidationPrices';
import CurrentPrice from './CurrentPrice';
import { formatLeverage } from 'utils/format';
import { useCurrentLeverage } from 'hooks/useData';
import './index.scss';

interface Props {
  changeBorrowedA?: number;
  changeBorrowedB?: number;
  changeCollateral?: number;
  hideIfNull?: boolean;
}

/**
 * Generates lending pool aggregate details.
 */

const RiskMetrics = ({
  changeBorrowedA,
  changeBorrowedB,
  changeCollateral,
  hideIfNull
} : Props): JSX.Element | null => {
  const changes =
    changeBorrowedA ||
    changeBorrowedB ||
    changeCollateral ? {
        changeBorrowedA: changeBorrowedA ?? 0,
        changeBorrowedB: changeBorrowedB ?? 0,
        changeCollateral: changeCollateral ?? 0
      } : undefined;

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
};

export default RiskMetrics;
