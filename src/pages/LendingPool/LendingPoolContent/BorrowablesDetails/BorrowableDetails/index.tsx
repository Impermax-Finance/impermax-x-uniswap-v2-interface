
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
  useSymbol,
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
  formatNumberWithUSDCommaDecimals,
  formatNumberWithPercentageCommaDecimals
} from 'utils/helpers/format-number';
import { PARAMETERS } from 'utils/constants/links';
import { W_ETH_ADDRESSES } from 'config/web3/contracts/w-eths';
import useLendingPools, { LendingPoolData } from 'services/hooks/use-lending-pools';
import { PoolTokenType } from 'types/interfaces';

/**
 * Generate the Currency Equity Details card,
 * giving information about the supply and rates for a particular currency in the system.
 */

const getTokenName = (
  lendingPool: LendingPoolData,
  poolTokenType: PoolTokenType.BorrowableA | PoolTokenType.BorrowableB,
  chainID: number
) => {
  const wETHAddress = W_ETH_ADDRESSES[chainID];
  const lowerCasedWETHAddress = wETHAddress.toLowerCase();
  const underlyingAddress = lendingPool[poolTokenType].underlying.id;

  if (underlyingAddress === lowerCasedWETHAddress) {
    return 'Ethereum';
  } else {
    return lendingPool[poolTokenType].underlying.name;
  }
};

interface Props {
  poolTokenType: PoolTokenType.BorrowableA | PoolTokenType.BorrowableB;
}

const BorrowableDetails = ({
  poolTokenType
}: Props): JSX.Element => {
  // ray test touch <<
  // const name = useName();
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
  const tokenName = getTokenName(selectedLendingPool, poolTokenType, selectedChainID);

  const borrowableDetails = [
    {
      name: 'Total Supply',
      value: formatNumberWithUSDCommaDecimals(supplyUSD)
    },
    {
      name: 'Total Borrow',
      value: formatNumberWithUSDCommaDecimals(totalBorrowsUSD)
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
          {tokenName} ({symbol})
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
