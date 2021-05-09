/* eslint-disable no-invalid-this */
// ray test touch <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// ray test touch >

import { Address, PoolTokenType, LendingPoolData, TvlData, UserData, CollateralPosition, SupplyPosition, BorrowPosition } from '../impermax-router/interfaces';
import gql from 'graphql-tag';
import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import Subgraph from '.';
import { DocumentNode } from 'graphql';

const SECONDS_IN_YEAR = 60 * 60 * 24 * 365;
const UNISWAP_FEE = 0.003;

export async function apolloFetcher(subgraphUrl: string, query: DocumentNode) {
  const client = new ApolloClient({
    link: new HttpLink({
      uri: subgraphUrl
    }),
    cache: new InMemoryCache()
  });
  return client.query({
    query: query,
    fetchPolicy: 'cache-first'
  });
}

// Fetch Lending Pools
export async function fetchLendingPools(this: Subgraph) : Promise<any[]> {
  const borrowableStr = `{
    id
    underlying {
      id
      symbol
      name
      decimals
      derivedUSD
    }
    totalBalance
    totalBorrows
    borrowRate
    reserveFactor
    kinkBorrowRate
    kinkUtilizationRate
    borrowIndex
    accrualTimestamp 
    exchangeRate 
    totalBalanceUSD
    totalSupplyUSD
    totalBorrowsUSD
    farmingPool {
      epochAmount
      epochBegin
      segmentLength
      vestingBegin
      sharePercentage
      distributor {
        id
      }
    }
  }`;
  const query = gql`{
    lendingPools(first: 1000, orderBy: totalBorrowsUSD, orderDirection: desc) {
      id
      borrowable0 ${ borrowableStr }
      borrowable1 ${ borrowableStr }
      collateral {
        id
        totalBalance
        totalBalanceUSD
        safetyMargin
        liquidationIncentive
        exchangeRate 
      }
      pair {
        reserve0
        reserve1
        reserveUSD
        token0Price
        token1Price
        derivedUSD
      }
    }
  }`;
  const result = await this.apolloFetcher(this.impermaxSubgraphUrl, query);
  return result.data.lendingPools;
}

// Uniswap APY
export async function fetchBlockByTimestamp(this: Subgraph, timestamp: number) : Promise<number> {
  const query = gql`{
    blocks (first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${timestamp + 600} }) {
      number
    }
  }`;
  const result = await this.apolloFetcher(this.blocklyticsSubgraphUrl, query);
  return result.data.blocks[0].number;
}

export async function fetchPastVolume(this: Subgraph, uniswapV2PairAddresses: string[], seconds: number) : Promise<{[key in Address]: number}> {
  const timestamp = Math.floor((new Date()).getTime() / 1000);
  const blockNumber = await this.fetchBlockByTimestamp(timestamp - seconds);
  let addressString = '';
  for (const uniswapV2PairAddress of uniswapV2PairAddresses) addressString += `"${uniswapV2PairAddress.toLowerCase()}",`;
  const query = gql`{
    pairs ( block: {number: ${blockNumber}} where: { id_in: [${addressString}]} ) {
      id
      volumeUSD
    }
  }`;
  const result = await this.apolloFetcher(this.uniswapSubgraphUrl, query);
  const pastVolume: {[key in Address]: number} = {};
  for (const pair of result.data.pairs) {
    pastVolume[pair.id] = parseInt(pair.volumeUSD);
  }
  return pastVolume;
}

export async function fetchCurrentVolumeAndReserves(this: Subgraph, uniswapV2PairAddresses: string[]) : Promise<{
  currentVolume: {[key in Address]: number},
  currentReserve: {[key in Address]: number},
}> {
  let addressString = '';
  for (const uniswapV2PairAddress of uniswapV2PairAddresses) addressString += `"${uniswapV2PairAddress.toLowerCase()}",`;
  const query = gql`{
    pairs ( where: { id_in: [${addressString}]} ) {
      id
      reserveUSD
      volumeUSD
    }
  }`;
  const result = await this.apolloFetcher(this.uniswapSubgraphUrl, query);
  const currentVolume: {[key in Address]: number} = {};
  const currentReserve: {[key in Address]: number} = {};
  for (const pair of result.data.pairs) {
    currentVolume[pair.id] = parseInt(pair.volumeUSD);
    currentReserve[pair.id] = parseInt(pair.reserveUSD);
  }
  return { currentReserve, currentVolume };
}

export async function fetchUniswapAPY(this: Subgraph, uniswapV2PairAddresses: string[], seconds: number = 60 * 60 * 24 * 7) : Promise<{[key in Address]: number}> {
  const pastVolume = await this.fetchPastVolume(uniswapV2PairAddresses, seconds);
  const { currentVolume, currentReserve } = await this.fetchCurrentVolumeAndReserves(uniswapV2PairAddresses);
  const uniswapAPY: {[key in Address]: number} = {};
  for (const uniswapV2PairAddress of uniswapV2PairAddresses) {
    if (!currentReserve[uniswapV2PairAddress]) {
      uniswapAPY[uniswapV2PairAddress] = 0;
      continue;
    }
    const cumVolumePast = pastVolume[uniswapV2PairAddress] ? pastVolume[uniswapV2PairAddress] : 0;
    const cumVolumeNow = currentVolume[uniswapV2PairAddress];
    const reserveUSD = currentReserve[uniswapV2PairAddress];
    const volumeUSD = cumVolumeNow - cumVolumePast;
    const yearlyVolume = volumeUSD * SECONDS_IN_YEAR / seconds;
    const yearlyFee = yearlyVolume * UNISWAP_FEE;
    uniswapAPY[uniswapV2PairAddress] = yearlyFee / reserveUSD;
  }
  return uniswapAPY;
}

// LendingPool Data
export async function initializeLendingPoolsData(this: Subgraph) : Promise<{[key in Address]?: LendingPoolData}> {
  const lendingPoolsData: {[key in Address]?: LendingPoolData} = {};
  const lendingPools = await this.fetchLendingPools();
  const uniswapV2PairAddresses = [];
  for (const lendingPool of lendingPools) {
    lendingPoolsData[lendingPool.id] = lendingPool;
    uniswapV2PairAddresses.push(lendingPool.id);
  }
  const uniswapAPY = await this.fetchUniswapAPY(uniswapV2PairAddresses);
  for (const lendingPool of lendingPools) {
    lendingPoolsData[lendingPool.id].pair.uniswapAPY = uniswapAPY[lendingPool.id];
  }
  return lendingPoolsData;
}
export async function getLendingPoolsData(this: Subgraph) : Promise<{[key in Address]: LendingPoolData}> {
  if (!this.lendingPoolsData) this.lendingPoolsData = this.initializeLendingPoolsData();
  return this.lendingPoolsData;
}
export async function getLendingPoolData(this: Subgraph, uniswapV2PairAddress: Address) : Promise<LendingPoolData> {
  return (await this.getLendingPoolsData())[uniswapV2PairAddress.toLowerCase()];
}

// TVL Data
export async function initializeTvlData(this: Subgraph) : Promise<TvlData> {
  const query = gql`{
    impermaxFactories(first: 1) {
      totalBalanceUSD
      totalSupplyUSD
      totalBorrowsUSD
    }
  }`;
  const result = await this.apolloFetcher(this.impermaxSubgraphUrl, query);
  return result.data.impermaxFactories[0];
}
export async function getTvlData(this: Subgraph) : Promise<TvlData> {
  if (!this.tvlData) this.tvlData = this.initializeTvlData();
  return this.tvlData;
}

// User Data
export async function fetchUserData(this: Subgraph, account: Address) : Promise<{
  collateralPositions: CollateralPosition[],
  supplyPositions: SupplyPosition[],
  borrowPositions: BorrowPosition[],
}> {
  const query = gql`{
    user(id: "${account.toLowerCase()}") {
      collateralPositions(first:1000) {
        balance
        collateral {
          lendingPool {
            id
          }
        }
      }
      supplyPositions(first:1000) {
        balance
        borrowable {
          underlying {
            id
          }
          lendingPool {
            id
          }
        }
      }
      borrowPositions(first:1000) {
        borrowBalance
        borrowIndex
        borrowable {
          underlying {
            id
          }
          lendingPool {
            id
          }
        }
      }
    }
  }`;
  const result = await this.apolloFetcher(this.impermaxSubgraphUrl, query);
  return result.data.user;
}
export async function initializeUserData(this: Subgraph, account: Address) : Promise<UserData> {
  const result: UserData = {
    collateralPositions: {},
    supplyPositions: {},
    borrowPositions: {}
  };
  const data = await this.fetchUserData(account);
  if (!data) return null;
  for (const collateralPosition of data.collateralPositions) {
    result.collateralPositions[collateralPosition.collateral.lendingPool.id] = collateralPosition;
  }
  for (const supplyPositions of data.supplyPositions) {
    const uniswapV2PairAddress = supplyPositions.borrowable.lendingPool.id;
    const underlyingAddress = supplyPositions.borrowable.underlying.id;
    const addressA = await this.getUnderlyingAddress(uniswapV2PairAddress, PoolTokenType.BorrowableA);
    const poolTokenType = underlyingAddress === addressA ? PoolTokenType.BorrowableA : PoolTokenType.BorrowableB;
    if (!(uniswapV2PairAddress in result.supplyPositions)) result.supplyPositions[uniswapV2PairAddress] = {};
    result.supplyPositions[uniswapV2PairAddress][poolTokenType] = supplyPositions;
  }
  for (const borrowPositions of data.borrowPositions) {
    const uniswapV2PairAddress = borrowPositions.borrowable.lendingPool.id;
    const underlyingAddress = borrowPositions.borrowable.underlying.id;
    const addressA = await this.getUnderlyingAddress(uniswapV2PairAddress, PoolTokenType.BorrowableA);
    const poolTokenType = underlyingAddress === addressA ? PoolTokenType.BorrowableA : PoolTokenType.BorrowableB;
    if (!(uniswapV2PairAddress in result.borrowPositions)) result.borrowPositions[uniswapV2PairAddress] = {};
    result.borrowPositions[uniswapV2PairAddress][poolTokenType] = borrowPositions;
  }
  return result;
}
export async function getUserData(this: Subgraph, account: Address) : Promise<UserData> {
  if (!(account in this.usersData)) this.usersData[account] = this.initializeUserData(account);
  return this.usersData[account];
}
