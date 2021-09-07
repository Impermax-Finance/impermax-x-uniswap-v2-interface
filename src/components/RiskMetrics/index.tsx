
import clsx from 'clsx';
import { ArrowRightIcon } from '@heroicons/react/outline';

import LiquidationPrices from './LiquidationPrices';
import CurrentPrice from './CurrentPrice';
import DetailList, { DetailListItem } from 'components/DetailList';
import { formatLeverage } from 'utils/format';
import { useCurrentLeverage } from 'hooks/useData';

interface Props {
  changeBorrowedA?: number;
  changeBorrowedB?: number;
  changeCollateral?: number;
  hideIfNull?: boolean;
  safetyMargin: number;
}

/**
 * Generates lending pool aggregate details.
 */

const RiskMetrics = ({
  changeBorrowedA,
  changeBorrowedB,
  changeCollateral,
  hideIfNull,
  safetyMargin
} : Props): JSX.Element | null => {
  const changes =
    changeBorrowedA ||
    changeBorrowedB ||
    changeCollateral ?
      {
        changeBorrowedA: changeBorrowedA ?? 0,
        changeBorrowedB: changeBorrowedB ?? 0,
        changeCollateral: changeCollateral ?? 0
      } :
      undefined;

  // ray test touch <<
  const currentLeverage = useCurrentLeverage();
  const newLeverage = useCurrentLeverage(changes);
  // ray test touch >>

  if (hideIfNull && currentLeverage === 1) return null;

  const leverageTooltip = 'Calculated as: Total Collateral / LP Equity';
  const liquidationTooltip = 'If the price crosses these boundaries, your account will become liquidatable.';

  return (
    <DetailList>
      {changes ? (
        <DetailListItem
          title='New Leverage'
          tooltip={leverageTooltip}>
          <span>{formatLeverage(currentLeverage)}</span>
          <ArrowRightIcon
            className={clsx(
              'w-6',
              'h-6'
            )} />
          <span>{formatLeverage(newLeverage)}</span>
        </DetailListItem>
      ) : (
        <DetailListItem
          title='Current Leverage'
          tooltip={leverageTooltip}>
          <span>{formatLeverage(currentLeverage)}</span>
        </DetailListItem>
      )}
      {changes ? (
        <DetailListItem
          title='New Liquidation Prices'
          tooltip={liquidationTooltip}>
          <LiquidationPrices safetyMargin={safetyMargin} />
          <ArrowRightIcon
            className={clsx(
              'w-6',
              'h-6'
            )} />
          <LiquidationPrices
            changes={changes}
            safetyMargin={safetyMargin} />
        </DetailListItem>
      ) : (
        <DetailListItem
          title='Liquidation Prices'
          tooltip={liquidationTooltip}>
          <LiquidationPrices safetyMargin={safetyMargin} />
        </DetailListItem>
      )}
      <CurrentPrice />
    </DetailList>
  );
};

export default RiskMetrics;
