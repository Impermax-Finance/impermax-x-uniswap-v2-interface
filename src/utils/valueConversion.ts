import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import gql from 'graphql-tag'
import { Networks } from "./connections";

export interface PairConversionPrices {
  LPPrice: number;
  tokenAPrice: number;
  tokenBPrice: number;
}

export async function getPairConversionPrices(uniswapV2PairAddress: string) : Promise<PairConversionPrices> {
  const query = gql`{
    pair (id: "${uniswapV2PairAddress.toLowerCase()}") {
      reserveUSD
      reserve0
      reserve1
      totalSupply
    }
  }`;
  const client = new ApolloClient({
    link: new HttpLink({
      uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
    }),
    cache: new InMemoryCache(),
  });
  const result = await client.query({
    query: query,
    fetchPolicy: 'cache-first',
  });
  const pair = result.data.pair;
  return {
    LPPrice: pair.reserveUSD / pair.totalSupply,
    tokenAPrice: pair.reserveUSD / 2 / pair.reserve0,
    tokenBPrice: pair.reserveUSD / 2 / pair.reserve1,
  };
}