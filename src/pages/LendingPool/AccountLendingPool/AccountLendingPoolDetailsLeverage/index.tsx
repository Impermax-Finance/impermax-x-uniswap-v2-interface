
import clsx from 'clsx';

import RiskMetrics from 'components/RiskMetrics';
import DetailList, { DetailListItem } from 'components/DetailList';
import { formatNumberWithUSDCommaDecimals } from 'utils/helpers/format-number';
import getLeverage from 'utils/helpers/get-leverage';
import getLiquidationPrices from 'utils/helpers/get-liquidation-prices';

/**
 * Generates lending pool aggregate details.
 */

interface Props {
  collateralDepositedInUSD: number;
  debtInUSD: number;
  lpEquityInUSD: number;
  safetyMargin: number;
  liquidationIncentive: number;
  twapPrice: number;
  valueCollateralWithoutChanges: number;
  valueAWithoutChanges: number;
  valueBWithoutChanges: number;
}

const AccountLendingPoolDetailsLeverage = ({
  collateralDepositedInUSD,
  debtInUSD,
  lpEquityInUSD,
  safetyMargin,
  liquidationIncentive,
  twapPrice,
  valueCollateralWithoutChanges,
  valueAWithoutChanges,
  valueBWithoutChanges
}: Props): JSX.Element => {
  const leftItems = [
    {
      title: 'Total Collateral',
      value: formatNumberWithUSDCommaDecimals(collateralDepositedInUSD)
    },
    {
      title: 'Total Debt',
      value: formatNumberWithUSDCommaDecimals(debtInUSD)
    },
    {
      title: 'LP Equity',
      value: formatNumberWithUSDCommaDecimals(lpEquityInUSD),
      tooltip: 'Calculated as: Total Collateral - Total Debt'
    }
  ];

  const changes = {
    changeCollateral: 0,
    changeBorrowedA: 0,
    changeBorrowedB: 0
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

  return (
    <div
      className={clsx(
        // TODO: componentize
        'space-y-6',
        'md:space-y-0',
        'md:grid',
        'md:grid-cols-2',
        'md:gap-6',
        'px-6',
        'py-6'
      )}>
      <DetailList>
        {leftItems.map(item => (
          <DetailListItem
            key={item.title}
            title={item.title}
            tooltip={item.tooltip}>
            <span>{item.value}</span>
          </DetailListItem>
        ))}
      </DetailList>
      <RiskMetrics
        safetyMargin={safetyMargin}
        twapPrice={twapPrice}
        changes={changes}
        currentLeverage={currentLeverage}
        newLeverage={newLeverage}
        currentLiquidationPrices={currentLiquidationPrices}
        newLiquidationPrices={newLiquidationPrices} />
    </div>
  );
};

export default AccountLendingPoolDetailsLeverage;
