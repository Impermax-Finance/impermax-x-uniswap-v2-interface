
import clsx from 'clsx';

import RiskMetrics from 'components/RiskMetrics';
import DetailList, { DetailListItem } from 'components/DetailList';
import {
  useDebtUSD,
  useDepositedUSD,
  useLPEquityUSD
} from 'hooks/useData';
import { formatUSD } from 'utils/format';
import { PoolTokenType } from 'types/interfaces';

/**
 * Generates lending pool aggregate details.
 */

const AccountLendingPoolDetailsLeverage = (): JSX.Element => {
  // ray test touch <<
  const collateralUSD = useDepositedUSD(PoolTokenType.Collateral);
  const debtUSD = useDebtUSD();
  const lpEquityUSD = useLPEquityUSD();
  // ray test touch >>

  const leftItems = [
    {
      title: 'Total Collateral',
      value: formatUSD(collateralUSD)
    },
    {
      title: 'Total Debt',
      value: formatUSD(debtUSD)
    },
    {
      title: 'LP Equity',
      value: formatUSD(lpEquityUSD),
      tooltip: 'Calculated as: Total Collateral - Total Debt'
    }
  ];

  return (
    <div
      className={clsx(
        // ray test touch <<
        // TODO: componentize
        'space-y-6',
        'md:space-y-0',
        'md:grid',
        'md:grid-cols-2',
        'md:gap-6',
        'px-6',
        'py-6'
        // ray test touch >>
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
      {/* ray test touch << */}
      <RiskMetrics />
      {/* ray test touch >> */}
    </div>
  );
};

export default AccountLendingPoolDetailsLeverage;
