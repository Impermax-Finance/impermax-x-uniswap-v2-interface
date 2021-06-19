
import { Link } from 'react-router-dom';
import clsx from 'clsx';

import Panel from 'components/Panel';
import ImpermaxImage from 'components/UI/ImpermaxImage';
import { PoolTokenType } from 'impermax-router/interfaces';
import {
  useSupplyUSD,
  useTotalBorrowsUSD,
  useSupplyAPY,
  useBorrowAPY,
  useSymbol,
  useUniswapAPY,
  useFarmingAPY
} from 'hooks/useData';
import { useTokenIcon } from 'hooks/useUrlGenerator';
import {
  formatUSD,
  formatPercentage
} from 'utils/format';
import useLendingPoolURL from 'hooks/use-lending-pool-url';

const LEVERAGE = 5;

const LendingPoolsRow = (): JSX.Element => {
  const symbolA = useSymbol(PoolTokenType.BorrowableA);
  const symbolB = useSymbol(PoolTokenType.BorrowableB);
  const supplyUSDA = useSupplyUSD(PoolTokenType.BorrowableA);
  const supplyUSDB = useSupplyUSD(PoolTokenType.BorrowableB);
  const totalBorrowsUSDA = useTotalBorrowsUSD(PoolTokenType.BorrowableA);
  const totalBorrowsUSDB = useTotalBorrowsUSD(PoolTokenType.BorrowableB);
  const supplyAPYA = useSupplyAPY(PoolTokenType.BorrowableA);
  const supplyAPYB = useSupplyAPY(PoolTokenType.BorrowableB);
  const borrowAPYA = useBorrowAPY(PoolTokenType.BorrowableA);
  const borrowAPYB = useBorrowAPY(PoolTokenType.BorrowableB);
  const farmingPoolAPYA = useFarmingAPY(PoolTokenType.BorrowableA);
  const farmingPoolAPYB = useFarmingAPY(PoolTokenType.BorrowableB);
  const tokenIconA = useTokenIcon(PoolTokenType.BorrowableA);
  const tokenIconB = useTokenIcon(PoolTokenType.BorrowableB);
  const lendingPoolUrl = useLendingPoolURL();
  const uniAPY = useUniswapAPY();
  const averageAPY = (borrowAPYA + borrowAPYB - farmingPoolAPYA - farmingPoolAPYB) / 2;
  const leveragedAPY = uniAPY * LEVERAGE - averageAPY * (LEVERAGE - 1);

  return (
    <Link
      to={lendingPoolUrl}
      className='block'>
      <Panel
        className={clsx(
          'px-4',
          'py-5',
          'md:p-6',
          'space-y-2',
          'hover:bg-gray-50'
        )}>
        <div
          className={clsx(
            'grid',
            'grid-cols-3',
            'gap-x-4'
          )}>
          <div
            className={clsx(
              'flex',
              'flex-shrink-0',
              'items-center',
              '-space-x-1.5'
            )}>
            <ImpermaxImage
              width={32}
              height={32}
              className={clsx(
                'inline-block',
                'rounded-full',
                'ring-2',
                'ring-white'
              )}
              src={tokenIconA}
              alt='' />
            <ImpermaxImage
              width={32}
              height={32}
              className={clsx(
                'inline-block',
                'rounded-full',
                'ring-2',
                'ring-white'
              )}
              src={tokenIconB}
              alt='' />
          </div>
          <div
            className={clsx(
              'flex',
              'flex-shrink-0',
              'items-center',
              'space-x-1.5'
            )}>
            <ImpermaxImage
              width={20}
              height={20}
              className='inline-block'
              src={tokenIconA}
              alt='' />
            <span className='font-medium'>{symbolA}</span>
          </div>
          <div
            className={clsx(
              'flex',
              'flex-shrink-0',
              'items-center',
              'space-x-1.5'
            )}>
            <ImpermaxImage
              width={20}
              height={20}
              className='inline-block'
              src={tokenIconB}
              alt='' />
            <span className='font-medium'>{symbolB}</span>
          </div>
        </div>
        <div
          className={clsx(
            'grid',
            'grid-cols-3',
            'gap-x-4',
            'gap-y-1.5'
          )}>
          <>
            {/* TODO: could componentize */}
            <h5
              className={clsx(
                'text-textSecondary',
                'font-medium',
                'text-sm',
                'self-center'
              )}>
              Total supply
            </h5>
            {/* TODO: could componentize */}
            <span>{formatUSD(supplyUSDA)}</span>
            <span>{formatUSD(supplyUSDB)}</span>
          </>
          <>
            <h5
              className={clsx(
                'text-textSecondary',
                'font-medium',
                'text-sm',
                'self-center'
              )}>
              Total borrowed
            </h5>
            <span>{formatUSD(totalBorrowsUSDA)}</span>
            <span>{formatUSD(totalBorrowsUSDB)}</span>
          </>
          <>
            <h5
              className={clsx(
                'text-textSecondary',
                'font-medium',
                'text-sm',
                'self-center'
              )}>
              Supply APY
            </h5>
            <span>{formatPercentage(supplyAPYA)}</span>
            <span>{formatPercentage(supplyAPYB)}</span>
          </>
          <>
            <h5
              className={clsx(
                'text-textSecondary',
                'font-medium',
                'text-sm',
                'self-center'
              )}>
              Borrow APY
            </h5>
            <span>{formatPercentage(borrowAPYA)}</span>
            <span>{formatPercentage(borrowAPYB)}</span>
          </>
          <>
            <h5
              className={clsx(
                'text-textSecondary',
                'font-medium',
                'text-sm',
                'self-center'
              )}>
              Leveraged LP APY
            </h5>
            <span
              className={clsx(
                'col-span-2',
                'justify-self-center',
                'text-lg',
                'font-medium',
                'text-impermaxAstral'
              )}>
              {formatPercentage(leveragedAPY)}
            </span>
          </>
        </div>
      </Panel>
    </Link>
  );
};

export default LendingPoolsRow;
