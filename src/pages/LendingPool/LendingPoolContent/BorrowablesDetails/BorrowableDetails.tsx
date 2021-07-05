// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import { Table } from 'react-bootstrap';
import { formatUSD, formatPercentage } from '../../../../utils/format';
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
} from '../../../../hooks/useData';
import { useTokenIcon } from '../../../../hooks/useUrlGenerator';
import clsx from 'clsx';

/**
 * Generate the Currency Equity Details card, giving information about the supply and rates for a particular currency in
 * the system.
 */

export default function BorrowableDetails(): JSX.Element {
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

  return (
    <div className='borrowable-details'>
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
}
