
import useLendingPools from 'services/hooks/use-lending-pools';
import { LendingPoolData } from 'types/interfaces';

const useLendingPool = (
  uniswapV2PairAddress: string,
  chainID: number
): {
  isLoading: boolean;
  data: LendingPoolData | undefined;
  error: Error | null;
} => {
  const {
    isLoading: lendingPoolsLoading,
    data: lendingPools,
    error: lendingPoolsError
  } = useLendingPools(chainID);

  const lowerCasedUniswapV2PairAddress = uniswapV2PairAddress.toLowerCase();

  const lendingPool =
    lendingPools?.find(lendingPool => lendingPool.id === lowerCasedUniswapV2PairAddress);

  return {
    isLoading: lendingPoolsLoading,
    data: lendingPool,
    error: lendingPoolsError
  };
};

export default useLendingPool;
