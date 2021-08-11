
import { Table } from 'react-bootstrap';
import clsx from 'clsx';

import BorrowableDetailsRow from './BorrowableDetailsRow';
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
import { formatUSD, formatPercentage } from 'utils/format';

/**
 * Generate the Currency Equity Details card,
 * giving information about the supply and rates for a particular currency in the system.
 */

const BorrowableDetails = (): JSX.Element => {
  const name = useName();
  const symbol = useSymbol();
  const supplyUSD = useSupplyUSD();
  const totalBorrowsUSD = useTotalBorrowsUSD();
  const utilizationRate = useUtilizationRate();
  const supplyAPY = useSupplyAPY();
  const borrowAPY = useBorrowAPY();
  const hasFarming = useHasFarming();
  const farmingAPY = useFarmingAPY();
  const tokenIcon = useTokenIcon();

  // ray test touch <<
  return (
    <div>
      <div className='header'>
        <img
          className={clsx(
            'currency-icon',
            'inline-block'
          )}
          src={tokenIcon}
          alt='' />
        {name} ({symbol})
      </div>
      <Table>
        <tbody>
          <BorrowableDetailsRow
            name='Total Supply'
            value={formatUSD(supplyUSD)} />
          <BorrowableDetailsRow
            name='Total Borrow'
            value={formatUSD(totalBorrowsUSD)} />
          <BorrowableDetailsRow
            name='Utilization Rate'
            value={formatPercentage(utilizationRate)} />
          <BorrowableDetailsRow
            name='Supply APY'
            value={formatPercentage(supplyAPY)} />
          <BorrowableDetailsRow
            name='Borrow APY'
            value={formatPercentage(borrowAPY)} />
          {hasFarming && (<BorrowableDetailsRow
            name='Farming APY'
            value={formatPercentage(farmingAPY)} />)}
        </tbody>
      </Table>
    </div>
  );
  // ray test touch >>
};

export default BorrowableDetails;
