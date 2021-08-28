
import clsx from 'clsx';

import DetailList, { DetailListItem } from 'components/DetailList';
import {
  useSuppliedUSD,
  useAccountAPY
} from 'hooks/useData';
import {
  formatNumberWithUSDCommaDecimals,
  formatNumberWithPercentageCommaDecimals
} from 'utils/helpers/format-number';

/**
 * Generates lending pool aggregate details.
 */

const AccountLendingPoolDetailsEarnInterest = (): JSX.Element => {
  // ray test touch <<<
  const suppliedUSD = useSuppliedUSD();
  // ray test touch >>>
  // ray test touch <<
  const accountAPY = useAccountAPY();
  // ray test touch >>

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
        <DetailListItem title='Supply Balance'>
          {formatNumberWithUSDCommaDecimals(suppliedUSD)}
        </DetailListItem>
      </DetailList>
      <DetailList>
        <DetailListItem title='Net APY'>
          {formatNumberWithPercentageCommaDecimals(accountAPY)}
        </DetailListItem>
      </DetailList>
    </div>
  );
};

export default AccountLendingPoolDetailsEarnInterest;
