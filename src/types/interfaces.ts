
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';

import Subgraph from 'subgraph';

interface Collateral {
  exchangeRate: string;
  id: Address;
  liquidationIncentive: string;
  safetyMargin: string;
  totalBalance: string;
  totalBalanceUSD: string;
}

interface Underlying {
  decimals: string;
  derivedUSD: string;
  id: Address;
  name: string;
  symbol: string;
}

interface Pair {
  derivedUSD: string;
  reserve0: string;
  reserve1: string;
  reserveUSD: string;
  token0Price: string;
  token1Price: string;
  uniswapAPY: number;
}

interface FarmingPool {
  distributor: {
    id: string;
  };
  epochAmount: string;
  epochBegin: string;
  segmentLength: string;
  sharePercentage: string;
  vestingBegin: string;
}

export type PoolTokenContract = Contract;
export type BorrowableContract = Contract;
export type UniswapV2PairContract = Contract;
export type ERC20Contract = Contract;
export type Address = string;
export type RouterContract = Contract;
export type FactoryContract = Contract;
export type SimpleUniswapOracleContract = Contract;
export type UniswapV2FactoryContract = Contract;
export type CollateralContract = Contract;
export type MerkleDistributorContract = Contract;
export type FarmingPoolContract = Contract;
export type ClaimAggregatorContract = Contract;
export type ClaimableContract = Contract;
export type ReservesDistributorContract = Contract;
export type StakingRouterContract = Contract;

export type LendingPool = {
  uniswapV2Pair: UniswapV2PairContract;
  tokenA: ERC20Contract;
  tokenB: ERC20Contract;
  collateral: CollateralContract;
  borrowableA: BorrowableContract;
  borrowableB: BorrowableContract;
  farmingPoolA: FarmingPoolContract;
  farmingPoolB: FarmingPoolContract;
}

export enum PoolTokenType {
  Collateral = 'collateral',
  BorrowableA = 'borrowable0',
  BorrowableB = 'borrowable1'
}

export enum ApprovalType {
  POOL_TOKEN,
  UNDERLYING,
  BORROW,
  STAKE,
  UNSTAKE,
}

export interface Changes {
  changeBorrowedA: number;
  changeBorrowedB: number;
  changeCollateral: number;
}
export const NO_CHANGES = {
  changeBorrowedA: 0,
  changeBorrowedB: 0,
  changeCollateral: 0
};

export interface ImpermaxRouterConfigInterface {
  subgraph: Subgraph;
  chainId: number;
  priceInverted: boolean;
  library: Web3Provider;
}

export interface Borrowable {
  accrualTimestamp: string;
  borrowIndex: string;
  borrowRate: string;
  exchangeRate: string;
  farmingPool: FarmingPool;
  id: Address;
  kinkBorrowRate: string;
  kinkUtilizationRate: string;
  reserveFactor: string;
  totalBalance: string;
  totalBalanceUSD: string;
  totalBorrows: string;
  totalBorrowsUSD: string;
  underlying: Underlying;
}

export interface LendingPoolData {
  [PoolTokenType.BorrowableA]: Borrowable;
  [PoolTokenType.BorrowableB]: Borrowable;
  [PoolTokenType.Collateral]: Collateral;
  id: string;
  pair: Pair;
}

export interface CollateralPosition {
  balance: string;
  collateral: {
    lendingPool: {
      id: Address;
    }
  }
}

export interface SupplyPosition {
  balance: string;
  borrowable: {
    underlying: {
      id: Address
    };
    lendingPool: {
      id: Address;
    }
  }
}

export interface BorrowPosition {
  borrowBalance: string;
  borrowIndex: string;
  borrowable: {
    underlying: {
      id: Address
    };
    lendingPool: {
      id: Address;
    }
  }
}

export interface UserData {
  collateralPositions: { [key in Address]: CollateralPosition };
  supplyPositions: { [key in Address]: { [key in PoolTokenType]?: SupplyPosition } };
  borrowPositions: { [key in Address]: { [key in PoolTokenType]?: BorrowPosition } };
}

export interface TvlData {
  totalBalanceUSD: string;
  totalBorrowsUSD: string;
  totalSupplyUSD: string;
}

export interface ClaimEvent {
  amount: number;
  transactionHash: string;
}
