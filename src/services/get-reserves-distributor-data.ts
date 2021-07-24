
// ray test touch <<<
import gql from 'graphql-tag';

import apolloFetcher from './apollo-fetcher';
import { IMX_STAKING_SUBGRAPH_URL } from 'config/web3/subgraph';

interface ReservesDistributorData {
  balance: string;
  periodLength: string;
  lastClaim: string;
  distributed: string;
}

const query = gql`{
  reservesDistributors(first:1) {
    balance
    periodLength
    lastClaim
    distributed
  }
}`;

const getReservesDistributorData = async (chainID: number): Promise<ReservesDistributorData> => {
  const impermaxSubgraphURL = IMX_STAKING_SUBGRAPH_URL[chainID];
  const result = await apolloFetcher(impermaxSubgraphURL, query);

  return result.data.reservesDistributors[0];
};

export default getReservesDistributorData;
// ray test touch >>>
