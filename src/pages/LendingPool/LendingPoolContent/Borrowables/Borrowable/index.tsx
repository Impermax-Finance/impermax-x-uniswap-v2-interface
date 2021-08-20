
import { useParams } from 'react-router-dom';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import clsx from 'clsx';

import List, { ListItem } from 'components/List';
import Panel from 'components/Panel';
import ErrorFallback from 'components/ErrorFallback';
import ImpermaxImage from 'components/UI/ImpermaxImage';
import { IMX_ADDRESSES } from 'config/web3/contracts/imxes';
import { W_ETH_ADDRESSES } from 'config/web3/contracts/w-eths';
import { UNISWAP_V2_FACTORY_ADDRESSES } from 'config/web3/contracts/uniswap-v2-factories';
import toAPY from 'utils/helpers/to-apy';
import getPairAddress from 'utils/helpers/web3/get-pair-address';
import {
  formatNumberWithUSDCommaDecimals,
  formatNumberWithPercentageCommaDecimals
} from 'utils/helpers/format-number';
import {
  getLendingPoolTokenName,
  getLendingPoolTokenSymbol,
  getLendingPoolTokenTotalSupplyInUSD,
  getLendingPoolTokenTotalBorrowInUSD,
  getLendingPoolTokenUtilizationRate,
  getLendingPoolTokenSupplyAPY,
  getLendingPoolTokenBorrowAPY,
  getLendingPoolTokenIcon,
  getLendingPoolTokenPrice
} from 'utils/helpers/lending-pools';
import { PARAMETERS } from 'utils/constants/links';
import useLendingPools from 'services/hooks/use-lending-pools';
import useFarmingPoolAddresses from 'services/hooks/use-farming-pool-addresses';
import {
  PoolTokenType,
  LendingPoolData
} from 'types/interfaces';

const getIMXPrice = (
  chainID: number,
  lendingPools: Array<LendingPoolData>
) => {
  const imxAddress = IMX_ADDRESSES[chainID];
  const wETHAddress = W_ETH_ADDRESSES[chainID];
  const uniswapV2FactoryAddress = UNISWAP_V2_FACTORY_ADDRESSES[chainID];
  const imxPair = getPairAddress(wETHAddress, imxAddress, uniswapV2FactoryAddress).toLowerCase();
  const imxLendingPool = lendingPools.find(lendingPool => lendingPool.id === imxPair);
  if (!imxLendingPool) {
    throw new Error('Something went wrong!');
  }
  const aAddress = imxLendingPool[PoolTokenType.BorrowableA].underlying.id;
  const poolTokenType =
    aAddress.toLowerCase() === imxAddress.toLowerCase() ?
      PoolTokenType.BorrowableA :
      PoolTokenType.BorrowableB;

  return getLendingPoolTokenPrice(imxLendingPool, poolTokenType);
};

const getRewardSpeed = (
  lendingPool: LendingPoolData,
  poolTokenType: PoolTokenType.BorrowableA | PoolTokenType.BorrowableB
) => {
  const farmingPool = lendingPool[poolTokenType].farmingPool;
  if (farmingPool === null) {
    return 0;
  }
  const segmentLength = parseInt(farmingPool.segmentLength);
  const epochBegin = parseInt(farmingPool.epochBegin);
  const epochAmount = parseFloat(farmingPool.epochAmount);
  const epochEnd = epochBegin + segmentLength;
  const timestamp = new Date().getTime() / 1000;
  if (timestamp > epochEnd) {
    // How to manage better this case? Maybe check shares on distributor
    return 0;
  }
  return epochAmount / segmentLength;
};

/**
 * Generate the Currency Equity Details card,
 * giving information about the supply and rates for a particular currency in the system.
 */

interface Props {
  poolTokenType: PoolTokenType.BorrowableA | PoolTokenType.BorrowableB;
}

const Borrowable = ({
  poolTokenType
}: Props): JSX.Element => {
  const {
    [PARAMETERS.CHAIN_ID]: selectedChainIDParam,
    [PARAMETERS.UNISWAP_V2_PAIR_ADDRESS]: selectedUniswapV2PairAddress
  } = useParams<Record<string, string>>();
  const selectedChainID = Number(selectedChainIDParam);

  const { library } = useWeb3React<Web3Provider>();
  const {
    isLoading: farmingPoolAddressesLoading,
    data: {
      farmingPoolAAddress,
      farmingPoolBAddress
    },
    error: farmingPoolAddressesError
  } = useFarmingPoolAddresses(selectedChainID, selectedUniswapV2PairAddress, library);
  useErrorHandler(farmingPoolAddressesError);

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
  if (farmingPoolAddressesLoading) {
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

  const tokenName = getLendingPoolTokenName(selectedLendingPool, poolTokenType, selectedChainID);
  const tokenSymbol = getLendingPoolTokenSymbol(selectedLendingPool, poolTokenType, selectedChainID);
  const tokenTotalSupplyInUSD = getLendingPoolTokenTotalSupplyInUSD(selectedLendingPool, poolTokenType);
  const tokenTotalBorrowInUSD = getLendingPoolTokenTotalBorrowInUSD(selectedLendingPool, poolTokenType);
  const tokenUtilizationRate = getLendingPoolTokenUtilizationRate(selectedLendingPool, poolTokenType);
  const tokenSupplyAPY = getLendingPoolTokenSupplyAPY(selectedLendingPool, poolTokenType);
  const tokenBorrowAPY = getLendingPoolTokenBorrowAPY(selectedLendingPool, poolTokenType);
  const tokenIcon = getLendingPoolTokenIcon(selectedLendingPool, poolTokenType);

  const imxPrice = getIMXPrice(selectedChainID, lendingPools);
  const rewardSpeed = getRewardSpeed(selectedLendingPool, poolTokenType);
  let farmingAPY;
  if (tokenTotalBorrowInUSD === 0) {
    farmingAPY = 0;
  } else {
    farmingAPY = toAPY(imxPrice * rewardSpeed / tokenTotalBorrowInUSD);
  }

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
      value: formatNumberWithPercentageCommaDecimals(tokenUtilizationRate)
    },
    {
      name: 'Supply APY',
      value: formatNumberWithPercentageCommaDecimals(tokenSupplyAPY)
    },
    {
      name: 'Borrow APY',
      value: formatNumberWithPercentageCommaDecimals(tokenBorrowAPY)
    }
  ];
  if (
    (poolTokenType === PoolTokenType.BorrowableA && farmingPoolAAddress) ||
    (poolTokenType === PoolTokenType.BorrowableB && farmingPoolBAddress)
  ) {
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

export default withErrorBoundary(Borrowable, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
