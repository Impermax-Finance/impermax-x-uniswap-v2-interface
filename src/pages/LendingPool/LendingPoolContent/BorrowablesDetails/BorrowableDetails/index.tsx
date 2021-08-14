
import { useParams } from 'react-router-dom';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import clsx from 'clsx';

import List, { ListItem } from 'components/List';
import Panel from 'components/Panel';
import ErrorFallback from 'components/ErrorFallback';
import ImpermaxImage from 'components/UI/ImpermaxImage';
import {
  useSupplyAPY,
  useBorrowAPY,
  useFarmingAPY,
  useHasFarming
} from 'hooks/useData';
import { useTokenIcon } from 'hooks/useUrlGenerator';
import {
  formatNumberWithUSDCommaDecimals,
  formatNumberWithPercentageCommaDecimals
} from 'utils/helpers/format-number';
// ray test touch <<
import {
  getLendingPoolTokenName,
  getLendingPoolTokenSymbol,
  getLendingPoolTokenTotalSupplyInUSD,
  getLendingPoolTokenTotalBorrowInUSD,
  getLendingPoolTokenUtilizationRate
} from 'utils/helpers/lending-pools';
// ray test touch >>
import { PARAMETERS } from 'utils/constants/links';
import useLendingPools from 'services/hooks/use-lending-pools';
import { PoolTokenType } from 'types/interfaces';

/**
 * Generate the Currency Equity Details card,
 * giving information about the supply and rates for a particular currency in the system.
 */

interface Props {
  poolTokenType: PoolTokenType.BorrowableA | PoolTokenType.BorrowableB;
}

const BorrowableDetails = ({
  poolTokenType
}: Props): JSX.Element => {
  const supplyAPY = useSupplyAPY();
  const borrowAPY = useBorrowAPY();
  const hasFarming = useHasFarming();
  const farmingAPY = useFarmingAPY();
  const tokenIcon = useTokenIcon();

  const {
    [PARAMETERS.CHAIN_ID]: selectedChainIDParam,
    [PARAMETERS.UNISWAP_V2_PAIR_ADDRESS]: selectedUniswapV2PairAddress
  } = useParams<Record<string, string>>();
  const selectedChainID = Number(selectedChainIDParam);

  const {
    isLoading: lendingPoolsLoading,
    data: lendingPools,
    error: lendingPoolsError
  } = useLendingPools(selectedChainID);
  useErrorHandler(lendingPoolsError);

  // TODO: should use skeleton loaders
  if (lendingPoolsLoading) {
    return <>Loading...</>;
  }
  if (lendingPools === undefined) {
    throw new Error('Something went wrong!');
  }

  const lowerCasedSelectedUniswapV2PairAddress = selectedUniswapV2PairAddress.toLowerCase();
  const selectedLendingPool =
    lendingPools.find(lendingPool => lendingPool.id === lowerCasedSelectedUniswapV2PairAddress);
  if (selectedLendingPool === undefined) {
    throw new Error('Something went wrong!');
  }

  // ray test touch <<
  const tokenName = getLendingPoolTokenName(selectedLendingPool, poolTokenType, selectedChainID);
  const tokenSymbol = getLendingPoolTokenSymbol(selectedLendingPool, poolTokenType, selectedChainID);
  const tokenTotalSupplyInUSD = getLendingPoolTokenTotalSupplyInUSD(selectedLendingPool, poolTokenType);
  const tokenTotalBorrowInUSD = getLendingPoolTokenTotalBorrowInUSD(selectedLendingPool, poolTokenType);
  const utilizationRate = getLendingPoolTokenUtilizationRate(selectedLendingPool, poolTokenType);
  // ray test touch >>

  const borrowableDetails = [
    {
      name: 'Total Supply',
      value: formatNumberWithUSDCommaDecimals(tokenTotalSupplyInUSD)
    },
    {
      name: 'Total Borrow',
      value: formatNumberWithUSDCommaDecimals(tokenTotalBorrowInUSD)
    },
    {
      name: 'Utilization Rate',
      value: formatNumberWithPercentageCommaDecimals(utilizationRate)
    },
    {
      name: 'Supply APY',
      value: formatNumberWithPercentageCommaDecimals(supplyAPY)
    },
    {
      name: 'Borrow APY',
      value: formatNumberWithPercentageCommaDecimals(borrowAPY)
    }
  ];
  if (hasFarming) {
    borrowableDetails.push({
      name: 'Farming APY',
      value: formatNumberWithPercentageCommaDecimals(farmingAPY)
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
          {tokenName} ({tokenSymbol})
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

export default withErrorBoundary(BorrowableDetails, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
