
import { Link } from 'react-router-dom';
import clsx from 'clsx';

import LendingPoolDesktopGridWrapper from './LendingPoolDesktopGridWrapper';
import LendingPoolMobileGridWrapper from './LendingPoolMobileGridWrapper';
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

interface PairCellCustomProps {
  tokenIconA: string;
  tokenIconB: string;
  symbolA: string;
  symbolB: string;
}

const TokenPairLabel = ({
  tokenIconA,
  tokenIconB,
  symbolA,
  symbolB,
  className
}: PairCellCustomProps & React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <div
    className={clsx(
      'flex',
      'flex-shrink-0',
      'items-center',
      '-space-x-1.5',
      className
    )}>
    <ImpermaxImage
      width={32}
      height={32}
      // TODO: could componentize
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
    <span
      className={clsx(
        'font-medium',
        'text-textSecondary',
        '!ml-1.5'
      )}>
      {symbolA}/{symbolB}
    </span>
  </div>
);

interface TokenLabelProps {
  tokenIcon: string;
  symbol: string;
}

const TokenLabel = ({
  tokenIcon,
  symbol
}: TokenLabelProps): JSX.Element => (
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
      className={clsx(
        'inline-block',
        'rounded-full',
        'ring-2',
        'ring-white'
      )}
      src={tokenIcon}
      alt='' />
    <span
      className={clsx(
        'font-medium',
        'text-textSecondary'
      )}>
      {symbol}
    </span>
  </div>
);

const PropertyLabel = ({
  className,
  children,
  ...rest
}: React.ComponentPropsWithRef<'h5'>) => (
  <h5
    className={clsx(
      'text-textSecondary',
      'font-medium',
      'text-sm',
      className
    )}
    {...rest}>
    {children}
  </h5>
);

const Value = (props: React.ComponentPropsWithRef<'span'>): JSX.Element => (
  <span {...props} />
);

const SetWrapper = ({
  className,
  children
}: React.ComponentPropsWithRef<'div'>) => (
  <div
    className={clsx(
      'flex',
      'flex-col',
      'space-y-1',
      className
    )}>
    {children}
  </div>
);

interface Props {
  greaterThanMd: boolean;
}

const LendingPool = ({
  greaterThanMd
}: Props): JSX.Element => {
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
          'hover:bg-gray-50'
        )}>
        {greaterThanMd ? (
          <LendingPoolDesktopGridWrapper>
            <TokenPairLabel
              className='col-span-2'
              tokenIconA={tokenIconA}
              tokenIconB={tokenIconB}
              symbolA={symbolA}
              symbolB={symbolB} />
            <SetWrapper>
              <TokenLabel
                tokenIcon={tokenIconA}
                symbol={symbolA} />
              <TokenLabel
                tokenIcon={tokenIconB}
                symbol={symbolB} />
            </SetWrapper>
            <SetWrapper>
              <Value>{formatUSD(supplyUSDA)}</Value>
              <Value>{formatUSD(supplyUSDB)}</Value>
            </SetWrapper>
            <SetWrapper>
              <Value>{formatUSD(totalBorrowsUSDA)}</Value>
              <Value>{formatUSD(totalBorrowsUSDB)}</Value>
            </SetWrapper>
            <SetWrapper>
              <Value>{formatPercentage(supplyAPYA)}</Value>
              <Value>{formatPercentage(supplyAPYB)}</Value>
            </SetWrapper>
            <SetWrapper>
              <Value>{formatPercentage(borrowAPYA)}</Value>
              <Value>{formatPercentage(borrowAPYB)}</Value>
            </SetWrapper>
            <Value
              className={clsx(
                'self-center',
                'justify-self-center',
                'text-lg',
                'font-medium',
                'text-impermaxAstral'
              )}>
              {formatPercentage(leveragedAPY)}
            </Value>
          </LendingPoolDesktopGridWrapper>
        ) : (
          <>
            <LendingPoolMobileGridWrapper>
              <TokenPairLabel
                tokenIconA={tokenIconA}
                tokenIconB={tokenIconB}
                symbolA={symbolA}
                symbolB={symbolB} />
              <TokenLabel
                tokenIcon={tokenIconA}
                symbol={symbolA} />
              <TokenLabel
                tokenIcon={tokenIconB}
                symbol={symbolB} />
            </LendingPoolMobileGridWrapper>
            <LendingPoolMobileGridWrapper
              className={clsx(
                'gap-y-1.5',
                'mt-2.5'
              )}>
              <>
                <PropertyLabel className='self-center'>
                  Total supply
                </PropertyLabel>
                <Value>{formatUSD(supplyUSDA)}</Value>
                <Value>{formatUSD(supplyUSDB)}</Value>
              </>
              <>
                <PropertyLabel className='self-center'>
                  Total borrowed
                </PropertyLabel>
                <Value>{formatUSD(totalBorrowsUSDA)}</Value>
                <Value>{formatUSD(totalBorrowsUSDB)}</Value>
              </>
              <>
                <PropertyLabel className='self-center'>
                  Supply APY
                </PropertyLabel>
                <Value>{formatPercentage(supplyAPYA)}</Value>
                <Value>{formatPercentage(supplyAPYB)}</Value>
              </>
              <>
                <PropertyLabel className='self-center'>
                  Borrow APY
                </PropertyLabel>
                <Value>{formatPercentage(borrowAPYA)}</Value>
                <Value>{formatPercentage(borrowAPYB)}</Value>
              </>
              <>
                <PropertyLabel className='self-center'>
                  Leveraged LP APY
                </PropertyLabel>
                <Value
                  className={clsx(
                    'col-span-2',
                    'justify-self-center',
                    'text-lg',
                    'font-medium',
                    'text-impermaxAstral'
                  )}>
                  {formatPercentage(leveragedAPY)}
                </Value>
              </>
            </LendingPoolMobileGridWrapper>
          </>
        )}
      </Panel>
    </Link>
  );
};

export default LendingPool;
