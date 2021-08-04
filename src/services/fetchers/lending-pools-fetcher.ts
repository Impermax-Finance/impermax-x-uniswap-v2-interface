
import getLendingPools, { LendingPoolData } from 'services/get-lending-pools';

const LENDING_POOLS_FETCHER = 'lending-pools-fetcher';

// TODO: should type properly
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const lendingPoolsFetcher = async ({ queryKey }: any): Promise<Array<LendingPoolData>> => {
  const [
    _key,
    chainID
  ] = queryKey;

  if (_key !== LENDING_POOLS_FETCHER) {
    throw new Error('Invalid key!');
  }

  return await getLendingPools(chainID);
};

export {
  LENDING_POOLS_FETCHER
};

export type {
  LendingPoolData
};

export default lendingPoolsFetcher;
