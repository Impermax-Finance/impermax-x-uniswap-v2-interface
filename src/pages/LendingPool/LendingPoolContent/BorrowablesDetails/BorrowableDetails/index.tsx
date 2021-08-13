
import clsx from 'clsx';

import List, { ListItem } from 'components/List';
import Panel from 'components/Panel';
import ImpermaxImage from 'components/UI/ImpermaxImage';
import {
  useSymbol,
  useName,
  useSupplyUSD,
  useTotalBorrowsUSD,
  useUtilizationRate,
  useSupplyAPY,
  useBorrowAPY,
  useFarmingAPY,
  useHasFarming
} from 'hooks/useData';
import { useTokenIcon } from 'hooks/useUrlGenerator';
import {
  formatUSD,
  formatPercentage
} from 'utils/format';

/**
 * Generate the Currency Equity Details card,
 * giving information about the supply and rates for a particular currency in the system.
 */

const BorrowableDetails = (): JSX.Element => {
  // ray test touch <<
  const name = useName();
  // ray test touch >>
  const symbol = useSymbol();
  const supplyUSD = useSupplyUSD();
  const totalBorrowsUSD = useTotalBorrowsUSD();
  const utilizationRate = useUtilizationRate();
  const supplyAPY = useSupplyAPY();
  const borrowAPY = useBorrowAPY();
  const hasFarming = useHasFarming();
  const farmingAPY = useFarmingAPY();
  const tokenIcon = useTokenIcon();

  const borrowableDetails = [
    {
      name: 'Total Supply',
      value: formatUSD(supplyUSD)
    },
    {
      name: 'Total Borrow',
      value: formatUSD(totalBorrowsUSD)
    },
    {
      name: 'Utilization Rate',
      value: formatPercentage(utilizationRate)
    },
    {
      name: 'Supply APY',
      value: formatPercentage(supplyAPY)
    },
    {
      name: 'Borrow APY',
      value: formatPercentage(borrowAPY)
    }
  ];
  if (hasFarming) {
    borrowableDetails.push({
      name: 'Farming APY',
      value: formatPercentage(farmingAPY)
    });
  }

  return (
    <Panel
      className={clsx(
        'px-6',
        'py-6',
        'bg-white'
      )}>
      <div
        className={clsx(
          'py-3',
          'flex',
          'items-center',
          'space-x-3'
        )}>
        <ImpermaxImage
          width={32}
          height={32}
          src={tokenIcon} />
        <h4
          className='text-lg'>
          {name} ({symbol})
        </h4>
      </div>
      <List>
        {borrowableDetails.map(detail => (
          <ListItem
            key={detail.name}
            className={clsx(
              'flex',
              'items-center',
              'justify-between'
            )}>
            <span>{detail.name}</span>
            <span>{detail.value}</span>
          </ListItem>
        ))}
      </List>
    </Panel>
  );
};

export default BorrowableDetails;
