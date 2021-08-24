
import clsx from 'clsx';

import DetailList, { DetailListItem } from 'components/DetailList';
import {
  useSuppliedUSD,
  useAccountAPY
} from 'hooks/useData';
import {
  formatUSD,
  formatPercentage
} from 'utils/format';

/**
 * Generates lending pool aggregate details.
 */

const AccountLendingPoolDetailsEarnInterest = (): JSX.Element => {
  // ray test touch <<
  const suppliedUSD = useSuppliedUSD();
  const accountAPY = useAccountAPY();
  // ray test touch >>

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
        <DetailListItem title='Supply Balance'>
          {formatUSD(suppliedUSD)}
        </DetailListItem>
      </DetailList>
      <DetailList>
        <DetailListItem title='Net APY'>
          {formatPercentage(accountAPY)}
        </DetailListItem>
      </DetailList>
    </div>
  );
};

export default AccountLendingPoolDetailsEarnInterest;
