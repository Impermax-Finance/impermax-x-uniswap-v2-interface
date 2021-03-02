import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import gql from 'graphql-tag'
import { Networks } from "./connections";

const SECONDS_IN_YEAR = 60 * 60 * 24 * 365;
const UNISWAP_FEE = 0.003;


export async function getBlockByTimestamp(timestamp: number) : Promise<number> {
  const query = gql`{
    blocks (first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${timestamp+600} }) {
      number
    }
  }`;
  const client = new ApolloClient({
    link: new HttpLink({
      uri: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks',
    }),
    cache: new InMemoryCache(),
  });
  const result = await client.query({
    query: query,
    fetchPolicy: 'cache-first',
  });
  return result.data.blocks[0].number;
}

export async function getUniswapAPY(uniswapV2PairAddress: string, seconds: number = 60 * 60 * 24) : Promise<number> {
  const timestamp = Math.floor((new Date).getTime() / 1000);
  const blockNumber = await getBlockByTimestamp(timestamp - seconds);
  const query = gql`{
    pairs ( block: {number: ${blockNumber}} where: { id: "${uniswapV2PairAddress.toLowerCase()}"} ) {
      volumeUSD
    }
    pair (id: "${uniswapV2PairAddress.toLowerCase()}") {
      reserveUSD
      volumeUSD
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
  if (result.data.pairs.length === 0) return 0;
  const volumeUSD = result.data.pair.volumeUSD - result.data.pairs[0].volumeUSD;
  const reserveUSD = result.data.pair.reserveUSD;
  const yearlyVolume = volumeUSD * SECONDS_IN_YEAR / seconds;
  const yearlyFee = yearlyVolume * UNISWAP_FEE;
  return yearlyFee / reserveUSD;
}

export async function getWeeklyUniswapAPY(uniswapV2PairAddress: string) : Promise<number> {
  return getUniswapAPY(uniswapV2PairAddress, 60 * 60 * 24 * 7)
}

export async function getDailyUniswapAPY(uniswapV2PairAddress: string) : Promise<number> {
  return getUniswapAPY(uniswapV2PairAddress, 60 * 60 * 24)
}