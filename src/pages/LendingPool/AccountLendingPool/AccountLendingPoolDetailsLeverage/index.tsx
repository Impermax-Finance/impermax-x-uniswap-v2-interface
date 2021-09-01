
import clsx from 'clsx';

import RiskMetrics from 'components/RiskMetrics';
import DetailList, { DetailListItem } from 'components/DetailList';
import {
  useDebtUSD,
  useLPEquityUSD
} from 'hooks/useData';
import { formatNumberWithUSDCommaDecimals } from 'utils/helpers/format-number';

/**
 * Generates lending pool aggregate details.
 */

interface Props {
  collateralDepositedInUSD: number;
}

const AccountLendingPoolDetailsLeverage = ({
  collateralDepositedInUSD
}: Props): JSX.Element => {
  // ray test touch <<
  const debtUSD = useDebtUSD();
  // ray test touch >>
  // ray test touch <<<
  const lpEquityUSD = useLPEquityUSD();
  // ray test touch >>>

  const leftItems = [
    {
      title: 'Total Collateral',
      value: formatNumberWithUSDCommaDecimals(collateralDepositedInUSD)
    },
    {
      title: 'Total Debt',
      value: formatNumberWithUSDCommaDecimals(debtUSD)
    },
    {
      title: 'LP Equity',
      value: formatNumberWithUSDCommaDecimals(lpEquityUSD),
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
