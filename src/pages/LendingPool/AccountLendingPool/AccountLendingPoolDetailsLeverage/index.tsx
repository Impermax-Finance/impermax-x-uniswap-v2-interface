
import clsx from 'clsx';

import RiskMetrics from 'components/RiskMetrics';
import DetailList, { DetailListItem } from 'components/DetailList';
import { formatNumberWithUSDCommaDecimals } from 'utils/helpers/format-number';

/**
 * Generates lending pool aggregate details.
 */

interface Props {
  collateralDepositedInUSD: number;
  debtInUSD: number;
  lpEquityInUSD: number;
}

const AccountLendingPoolDetailsLeverage = ({
  collateralDepositedInUSD,
  debtInUSD,
  lpEquityInUSD
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
      <RiskMetrics />
    </div>
  );
};

export default AccountLendingPoolDetailsLeverage;
