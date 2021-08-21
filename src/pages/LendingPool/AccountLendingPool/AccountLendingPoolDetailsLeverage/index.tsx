
import clsx from 'clsx';

import RiskMetrics from 'components/RiskMetrics';
import ImpermaxTooltip from 'components/UI/ImpermaxTooltip';
import {
  useDebtUSD,
  useDepositedUSD,
  useLPEquityUSD
} from 'hooks/useData';
import { formatUSD } from 'utils/format';
import { PoolTokenType } from 'types/interfaces';
import { ReactComponent as OutlineQuestionMarkCircleIcon } from 'assets/images/icons/outline-question-mark-circle.svg';

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
      name: 'Total Collateral',
      value: formatUSD(collateralUSD)
    },
    {
      name: 'Total Debt',
      value: formatUSD(debtUSD)
    },
    {
      name: 'LP Equity',
      value: formatUSD(lpEquityUSD),
      tooltip: 'Calculated as: Total Collateral - Total Debt'
    }
  ];

  return (
    <div
      className={clsx(
        'space-y-6',
        'md:space-y-0',
        'md:grid',
        'md:grid-cols-2',
        'md:gap-6',
        'px-6',
        'py-6'
      )}>
      <ul className='space-y-3'>
        {leftItems.map(item => (
          <li key={item.name}>
            <div
              className={clsx(
                'flex',
                'items-center',
                'space-x-1'
              )}>
              <span>{item.name}</span>
              {item.tooltip && (
                <ImpermaxTooltip label={item.tooltip}>
                  <OutlineQuestionMarkCircleIcon
                    width={18}
                    height={18} />
                </ImpermaxTooltip>
              )}
            </div>
            <div>
              <span className='font-bold'>{item.value}</span>
            </div>
          </li>
        ))}
      </ul>
      {/* ray test touch << */}
      <div>
        <RiskMetrics />
      </div>
      {/* ray test touch >> */}
    </div>
  );
};

export default AccountLendingPoolDetailsLeverage;
