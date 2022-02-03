
import getStakingRewardsData, { StakingRewardsData } from 'services/get-staking-rewards-data';

const STAKING_REWARDS_DATA_FETCHER = 'staking-rewards-data-fetcher';

// TODO: should type properly
// interface Arguments {
//   queryKey: [
//     string,
//     number
//   ]
// }

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const stakingRewardsDataFetcher = async ({ queryKey }: any): Promise<StakingRewardsData> => {
  const [
    _key,
    chainID
  ] = queryKey;

  if (_key !== STAKING_REWARDS_DATA_FETCHER) {
    throw new Error('Invalid key!');
  }

  return await getStakingRewardsData(chainID);
};

export {
  STAKING_REWARDS_DATA_FETCHER
};

export type {
  StakingRewardsData
};

export default stakingRewardsDataFetcher;
