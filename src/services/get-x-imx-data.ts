
import gql from 'graphql-tag';

import apolloFetcher from './apollo-fetcher';
import { IMX_STAKING_SUBGRAPH_URLS } from 'config/web3/subgraph';

const query = gql`{
  ximxes(first: 1) {
    totalSupply
    totalBalance
    exchangeRate
    dailyAPR
  }
}`;

const getXIMXData = async (chainID: number): Promise<XImxData> => {
  const impermaxSubgraphURL = IMX_STAKING_SUBGRAPH_URLS[chainID];
  const result = await apolloFetcher(impermaxSubgraphURL, query);

  return result.data.ximxes[0];
};

export interface XImxData {
  totalSupply: string;
  totalBalance: string;
  exchangeRate: string;
  dailyAPR: string;
}

export default getXIMXData;
