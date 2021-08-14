
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { getAddress } from '@ethersproject/address';

import LendingPoolListItemDesktopGridWrapper from './LendingPoolListItemDesktopGridWrapper';
import LendingPoolListItemMobileGridWrapper from './LendingPoolListItemMobileGridWrapper';
import Panel from 'components/Panel';
import ImpermaxImage from 'components/UI/ImpermaxImage';
import { IMX_ADDRESSES } from 'config/web3/contracts/imxes';
import toAPY from 'utils/helpers/web3/to-apy';
import {
  formatNumberWithUSDCommaDecimals,
  formatNumberWithPercentageCommaDecimals
} from 'utils/helpers/format-number';
// ray test touch <<
import {
  getLendingPoolTokenSymbol,
  getLendingPoolTokenTotalSupplyInUSD,
  getLendingPoolTokenTotalBorrowInUSD
} from 'utils/helpers/lending-pools';
// ray test touch >>
import {
  PAGES,
  PARAMETERS
} from 'utils/constants/links';
import {
  PoolTokenType,
  LendingPoolData
} from 'types/interfaces';

const LEVERAGE = 5;

interface TokenPairLabelCustomProps {
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
}: TokenPairLabelCustomProps & React.ComponentPropsWithRef<'div'>): JSX.Element => (
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
      placeholder='/assets/images/default.png'
      error='/assets/images/default.png'
      alt='Token A' />
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
      placeholder='/assets/images/default.png'
      error='/assets/images/default.png'
      alt='Token B' />
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
      placeholder='/assets/images/default.png'
      error='/assets/images/default.png'
      alt='Token' />
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

// ray test touch <<
const getLendingPoolSupplyAPY = (
  lendingPool: LendingPoolData,
  poolTokenType: PoolTokenType.BorrowableA | PoolTokenType.BorrowableB
): number => {
  const totalBalance = parseFloat(lendingPool[poolTokenType].totalBalance);
  const totalBorrows = parseFloat(lendingPool[poolTokenType].totalBorrows);
  const supply = totalBalance + totalBorrows;
  const utilizationRate = supply === 0 ? 0 : totalBorrows / supply; // TODO: could be a function

  const borrowRate = parseFloat(lendingPool[poolTokenType].borrowRate);
  const reserveFactor = parseFloat(lendingPool[poolTokenType].reserveFactor);
  const supplyRate = borrowRate * utilizationRate * (1 - reserveFactor); // TODO: could be a function

  const supplyAPY = toAPY(supplyRate);

  return supplyAPY;
};

const getLendingPoolBorrowAPY = (
  lendingPool: LendingPoolData,
  poolTokenType: PoolTokenType.BorrowableA | PoolTokenType.BorrowableB
): number => {
  const borrowRate = parseFloat(lendingPool[poolTokenType].borrowRate);
  const borrowAPY = toAPY(borrowRate);

  return borrowAPY;
};

const getLendingPoolTokenIcon = (
  lendingPool: LendingPoolData,
  poolTokenType: PoolTokenType.BorrowableA | PoolTokenType.BorrowableB
): string => {
  const tokenAddress = lendingPool[poolTokenType].underlying.id;
  const convertedAddress = getAddress(tokenAddress);

  return `/assets/images/token-logos/${convertedAddress}.png`;
};
// ray test touch >>

interface Props {
  chainID: number;
  imxLendingPool: LendingPoolData;
  lendingPool: LendingPoolData;
  greaterThanMd: boolean;
}

const LendingPoolListItem = ({
  chainID,
  imxLendingPool,
  lendingPool,
  greaterThanMd
}: Props): JSX.Element => {
  // ray test touch <<
  const symbolA = getLendingPoolTokenSymbol(lendingPool, PoolTokenType.BorrowableA, chainID);
  const symbolB = getLendingPoolTokenSymbol(lendingPool, PoolTokenType.BorrowableB, chainID);
  const supplyUSDA = getLendingPoolTokenTotalSupplyInUSD(lendingPool, PoolTokenType.BorrowableA);
  const supplyUSDB = getLendingPoolTokenTotalSupplyInUSD(lendingPool, PoolTokenType.BorrowableB);
  const totalBorrowsUSDA = getLendingPoolTokenTotalBorrowInUSD(lendingPool, PoolTokenType.BorrowableA);
  const totalBorrowsUSDB = getLendingPoolTokenTotalBorrowInUSD(lendingPool, PoolTokenType.BorrowableB);
  const supplyAPYA = getLendingPoolSupplyAPY(lendingPool, PoolTokenType.BorrowableA);
  const supplyAPYB = getLendingPoolSupplyAPY(lendingPool, PoolTokenType.BorrowableB);
  const borrowAPYA = getLendingPoolBorrowAPY(lendingPool, PoolTokenType.BorrowableA);
  const borrowAPYB = getLendingPoolBorrowAPY(lendingPool, PoolTokenType.BorrowableB);
  // ray test touch >>

  const imxAddress = IMX_ADDRESSES[chainID];
  const aAddress = imxLendingPool[PoolTokenType.BorrowableA].underlying.id;
  const poolTokenType =
    aAddress.toLowerCase() === imxAddress.toLowerCase() ?
      PoolTokenType.BorrowableA :
      PoolTokenType.BorrowableB;
  const imxPrice = Number(imxLendingPool[poolTokenType].underlying.derivedUSD);
  let rewardSpeed;
  const farmingPoolData = lendingPool[poolTokenType].farmingPool;
  if (farmingPoolData === null) {
    rewardSpeed = 0;
  } else {
    const segmentLength = parseInt(farmingPoolData.segmentLength);
    const epochBegin = parseInt(farmingPoolData.epochBegin);
    const epochAmount = parseFloat(farmingPoolData.epochAmount);
    const epochEnd = epochBegin + segmentLength;
    const timestamp = (new Date()).getTime() / 1000;
    if (timestamp > epochEnd) {
      // How to manage better this case? Maybe check shares on distributor
      rewardSpeed = 0;
    } else {
      rewardSpeed = epochAmount / segmentLength;
    }
  }
  let farmingPoolAPYA;
  if (totalBorrowsUSDA === 0) {
    farmingPoolAPYA = 0;
  } else {
    farmingPoolAPYA = toAPY(imxPrice * rewardSpeed / totalBorrowsUSDA);
  }
  let farmingPoolAPYB;
  if (totalBorrowsUSDA === 0) {
    farmingPoolAPYB = 0;
  } else {
    farmingPoolAPYB = toAPY(imxPrice * rewardSpeed / totalBorrowsUSDB);
  }

  const lendingPoolURL =
    PAGES.LENDING_POOL
      .replace(`:${PARAMETERS.CHAIN_ID}`, chainID.toString())
      .replace(`:${PARAMETERS.UNISWAP_V2_PAIR_ADDRESS}`, lendingPool.id);

  const uniswapAPY = lendingPool.pair.uniswapAPY;
  const averageAPY = (borrowAPYA + borrowAPYB - farmingPoolAPYA - farmingPoolAPYB) / 2;
  const leveragedAPY = uniswapAPY * LEVERAGE - averageAPY * (LEVERAGE - 1);
  const tokenIconA = getLendingPoolTokenIcon(lendingPool, PoolTokenType.BorrowableA);
  const tokenIconB = getLendingPoolTokenIcon(lendingPool, PoolTokenType.BorrowableB);

  return (
    <Link
      to={lendingPoolURL}
      className='block'>
      <Panel
        className={clsx(
          'bg-white',
          'px-4',
          'py-5',
          'md:p-6',
          'hover:bg-gray-50'
        )}>
        {greaterThanMd ? (
          <LendingPoolListItemDesktopGridWrapper>
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
              <Value>{formatNumberWithUSDCommaDecimals(supplyUSDA)}</Value>
              <Value>{formatNumberWithUSDCommaDecimals(supplyUSDB)}</Value>
            </SetWrapper>
            <SetWrapper>
              <Value>{formatNumberWithUSDCommaDecimals(totalBorrowsUSDA)}</Value>
              <Value>{formatNumberWithUSDCommaDecimals(totalBorrowsUSDB)}</Value>
            </SetWrapper>
            <SetWrapper>
              <Value>{formatNumberWithPercentageCommaDecimals(supplyAPYA)}</Value>
              <Value>{formatNumberWithPercentageCommaDecimals(supplyAPYB)}</Value>
            </SetWrapper>
            <SetWrapper>
              <Value>{formatNumberWithPercentageCommaDecimals(borrowAPYA)}</Value>
              <Value>{formatNumberWithPercentageCommaDecimals(borrowAPYB)}</Value>
            </SetWrapper>
            <Value
              className={clsx(
                'self-center',
                'justify-self-center',
                'text-lg',
                'font-medium',
                'text-impermaxAstral'
              )}>
              {formatNumberWithPercentageCommaDecimals(leveragedAPY)}
            </Value>
          </LendingPoolListItemDesktopGridWrapper>
        ) : (
          <>
            <LendingPoolListItemMobileGridWrapper>
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
            </LendingPoolListItemMobileGridWrapper>
            <LendingPoolListItemMobileGridWrapper
              className={clsx(
                'gap-y-1.5',
                'mt-2.5'
              )}>
              <>
                <PropertyLabel className='self-center'>
                  Total supply
                </PropertyLabel>
                <Value>{formatNumberWithUSDCommaDecimals(supplyUSDA)}</Value>
                <Value>{formatNumberWithUSDCommaDecimals(supplyUSDB)}</Value>
              </>
              <>
                <PropertyLabel className='self-center'>
                  Total borrowed
                </PropertyLabel>
                <Value>{formatNumberWithUSDCommaDecimals(totalBorrowsUSDA)}</Value>
                <Value>{formatNumberWithUSDCommaDecimals(totalBorrowsUSDB)}</Value>
              </>
              <>
                <PropertyLabel className='self-center'>
                  Supply APY
                </PropertyLabel>
                <Value>{formatNumberWithPercentageCommaDecimals(supplyAPYA)}</Value>
                <Value>{formatNumberWithPercentageCommaDecimals(supplyAPYB)}</Value>
              </>
              <>
                <PropertyLabel className='self-center'>
                  Borrow APY
                </PropertyLabel>
                <Value>{formatNumberWithPercentageCommaDecimals(borrowAPYA)}</Value>
                <Value>{formatNumberWithPercentageCommaDecimals(borrowAPYB)}</Value>
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
                  {formatNumberWithPercentageCommaDecimals(leveragedAPY)}
                </Value>
              </>
            </LendingPoolListItemMobileGridWrapper>
          </>
        )}
      </Panel>
    </Link>
  );
};

export default LendingPoolListItem;
