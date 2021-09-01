
import clsx from 'clsx';

import DetailList, { DetailListItem } from 'components/DetailList';
import { useAccountAPY } from 'hooks/useData';
import {
  formatNumberWithUSDCommaDecimals,
  formatNumberWithPercentageCommaDecimals
} from 'utils/helpers/format-number';

/**
 * Generates lending pool aggregate details.
 */

interface Props {
  supplyBalanceInUSD: number;
}

const AccountLendingPoolDetailsEarnInterest = ({
  supplyBalanceInUSD
}: Props): JSX.Element => {
  // ray test touch <<<
  const accountAPY = useAccountAPY();
  // ray test touch >>>

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
          {formatNumberWithUSDCommaDecimals(supplyBalanceInUSD)}
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
