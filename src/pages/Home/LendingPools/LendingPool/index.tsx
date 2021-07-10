
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { getAddress } from '@ethersproject/address';

import LendingPoolDesktopGridWrapper from './LendingPoolDesktopGridWrapper';
import LendingPoolMobileGridWrapper from './LendingPoolMobileGridWrapper';
import Panel from 'components/Panel';
import ImpermaxImage from 'components/UI/ImpermaxImage';
import toAPY from 'services/to-apy';
import getPairAddress from 'utils/helpers/web3/get-pair-address';
import {
  formatUSD,
  formatPercentage
} from 'utils/format';
import {
  PAGES,
  PARAMETERS
} from 'utils/constants/links';
import { WETH_ADDRESSES } from 'config/web3/contracts/weth';
import { IMX_ADDRESSES } from 'config/web3/contracts/imx';
import {
  Address,
  PoolTokenType,
  LendingPoolData
} from 'types/interfaces';

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

interface Props {
  chainID: number;
  lendingPoolsData: { [key in Address]: LendingPoolData };
  lendingPool: LendingPoolData;
  greaterThanMd: boolean;
}

const getLendingPoolSymbol = (
  // TODO: should type properly
  lendingPool: any,
  poolTokenType: PoolTokenType.BorrowableA | PoolTokenType.BorrowableB,
  chainID: number
): string => {
  const underlying = lendingPool[poolTokenType].underlying;
  const wethAddress = WETH_ADDRESSES[chainID];
  let symbol;
  if (underlying.id === wethAddress.toLowerCase()) {
    symbol = 'ETH';
  } else {
    symbol = underlying.symbol;
  }

  return symbol;
};

const getLendingPoolSupplyUSD = (
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

  const accrualTimestamp = parseFloat(lendingPool[poolTokenType].accrualTimestamp);
  const currentSupply = supply * (1 + (Date.now() / 1000 - accrualTimestamp) * supplyRate);
  const tokenPrice = parseFloat(lendingPool[poolTokenType].underlying.derivedUSD);
  const supplyUSD = currentSupply * tokenPrice;

  return supplyUSD;
};

const getLendingPoolTotalBorrowsUSD = (
  lendingPool: LendingPoolData,
  poolTokenType: PoolTokenType.BorrowableA | PoolTokenType.BorrowableB
): number => {
  const totalBorrows = parseFloat(lendingPool[poolTokenType].totalBorrows);
  const accrualTimestamp = parseFloat(lendingPool[poolTokenType].accrualTimestamp);
  const borrowRate = parseFloat(lendingPool[poolTokenType].borrowRate);
  const currentTotalBorrows = totalBorrows * (1 + (Date.now() / 1000 - accrualTimestamp) * borrowRate);
  const tokenPrice = parseFloat(lendingPool[poolTokenType].underlying.derivedUSD);
  // TODO: it's also from lendingPool[poolTokenType].totalBorrowsUSD. What is different?
  const totalBorrowsUSD = currentTotalBorrows * tokenPrice;

  return totalBorrowsUSD;
};

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

const LendingPool = ({
  chainID,
  lendingPoolsData,
  lendingPool,
  greaterThanMd
}: Props): JSX.Element => {
  const symbolA = getLendingPoolSymbol(lendingPool, PoolTokenType.BorrowableA, chainID);
  const symbolB = getLendingPoolSymbol(lendingPool, PoolTokenType.BorrowableB, chainID);
  const supplyUSDA = getLendingPoolSupplyUSD(lendingPool, PoolTokenType.BorrowableA);
  const supplyUSDB = getLendingPoolSupplyUSD(lendingPool, PoolTokenType.BorrowableB);
  const totalBorrowsUSDA = getLendingPoolTotalBorrowsUSD(lendingPool, PoolTokenType.BorrowableA);
  const totalBorrowsUSDB = getLendingPoolTotalBorrowsUSD(lendingPool, PoolTokenType.BorrowableB);
  const supplyAPYA = getLendingPoolSupplyAPY(lendingPool, PoolTokenType.BorrowableA);
  const supplyAPYB = getLendingPoolSupplyAPY(lendingPool, PoolTokenType.BorrowableB);
  const borrowAPYA = getLendingPoolBorrowAPY(lendingPool, PoolTokenType.BorrowableA);
  const borrowAPYB = getLendingPoolBorrowAPY(lendingPool, PoolTokenType.BorrowableB);

  const imxAddress = IMX_ADDRESSES[chainID];
  const wethAddress = WETH_ADDRESSES[chainID];
  const imxPair = getPairAddress(wethAddress, imxAddress, chainID).toLowerCase();
  const aAddress = lendingPoolsData[imxPair][PoolTokenType.BorrowableA].underlying.id;
  const poolTokenType =
    aAddress.toLowerCase() === imxAddress.toLowerCase() ?
      PoolTokenType.BorrowableA :
      PoolTokenType.BorrowableB;
  const imxLendingPoolData = lendingPoolsData[imxPair];
  const imxPrice = Number(imxLendingPoolData[poolTokenType].underlying.derivedUSD);
  let rewardSpeed;
  const lendingPoolData = lendingPoolsData[lendingPool.id];
  const farmingPoolData = lendingPoolData[poolTokenType].farmingPool;
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

  const uniswapAPY = lendingPoolsData[lendingPool.id].pair.uniswapAPY;
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
