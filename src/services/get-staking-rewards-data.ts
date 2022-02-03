
import gql from 'graphql-tag';

import apolloFetcher from './apollo-fetcher';
import { IMX_STAKING_SUBGRAPH_URLS } from 'config/web3/subgraphs';

const query = gql`{
  stakingRewards(first: 1) {
    totalBalance
    rewardRate
  }
}`;

interface StakingRewardsData {
  totalBalance: string;
  rewardRate: string;
}

const getStakingRewardsData = async (chainID: number): Promise<StakingRewardsData> => {
  const impermaxSubgraphURL = IMX_STAKING_SUBGRAPH_URLS[chainID];
  const result = await apolloFetcher(impermaxSubgraphURL, query);

  return result.data.stakingRewards[0];
};

export type {
  StakingRewardsData
};

export default getStakingRewardsData;
