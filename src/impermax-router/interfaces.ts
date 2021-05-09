import { BigNumber } from 'ethers';
import Subgraph from '../subgraph';

export type Address = string;
export type Contract = any;
export type Router = Contract;
export type Factory = Contract;
export type SimpleUniswapOracle = Contract;
export type ERC20 = Contract;
export type UniswapV2Pair = Contract;
export type UniswapV2Factory = Contract;
export type Borrowable = Contract;
export type Collateral = Contract;
export type MerkleDistributor = Contract;
export type FarmingPool = Contract;
export type ClaimAggregator = Contract;
export type Claimable = Contract;

export type LendingPool = {
  uniswapV2Pair: UniswapV2Pair,
  tokenA: ERC20,
  tokenB: ERC20,
  collateral: Collateral,
  borrowableA: Borrowable,
  borrowableB: Borrowable,
  farmingPoolA: FarmingPool,
  farmingPoolB: FarmingPool,
}

export enum PoolTokenType {
  Collateral = 'collateral',
  BorrowableA = 'borrowable0',
  BorrowableB = 'borrowable1',
}

export enum ApprovalType {
  POOL_TOKEN,
  UNDERLYING,
  BORROW,
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

export interface ImpermaxRouterCfg {
  subgraph: Subgraph;
  web3: any;
  chainId: number;
  routerAddress: Address;
  factoryAddress: Address;
  uniswapV2FactoryAddress: Address;
  simpleUniswapOracleAddress: Address;
  merkleDistributorAddress: Address;
  claimAggregatorAddress: Address;
  IMX: Address;
  WETH: Address;
  airdropUrl: string;
  priceInverted: boolean;
}

export interface BorrowableData {
  id: Address,
  underlying: TokenData,
  totalBalance: string,
  totalBorrows: string,
  borrowRate: string,
  reserveFactor: string,
  kinkBorrowRate: string,
  kinkUtilizationRate: string,
  borrowIndex: string,
  accrualTimestamp: string,
  exchangeRate: string,
  totalBalanceUSD: string,
  farmingPool: FarmingPoolData,
}

export interface CollateralData {
  id: Address,
  totalBalance: string,
  safetyMargin: string,
  liquidationIncentive: string,
  exchangeRate: string,
  totalBalanceUSD: string,
}

export interface TokenData {
  id: Address,
  symbol: string,
  name: string,
  decimals: string,
  derivedUSD: string,
}

export interface PairData {
  reserve0: string,
  reserve1: string,
  reserveUSD: string,
  token0Price: string,
  token1Price: string,
  derivedUSD: string,
  uniswapAPY: number,
}

export interface FarmingPoolData {
  epochAmount: string,
  epochBegin: string,
  segmentLength: string,
  vestingBegin: string,
  sharePercentage: string,
}

export interface LendingPoolData {
  [PoolTokenType.Collateral]: CollateralData,
  [PoolTokenType.BorrowableA]: BorrowableData,
  [PoolTokenType.BorrowableB]: BorrowableData,
  pair: PairData,
}

export interface CollateralPosition {
  balance: string,
  collateral: {
    lendingPool: {
      id: Address,
    }
  }
}

export interface SupplyPosition {
  balance: string,
  borrowable: {
    underlying: {
      id: Address
    },
    lendingPool: {
      id: Address,
    }
  }
}

export interface BorrowPosition {
  borrowBalance: string,
  borrowIndex: string,
  borrowable: {
    underlying: {
      id: Address
    },
    lendingPool: {
      id: Address,
    }
  }
}

export interface UserData {
  collateralPositions: { [key in Address]: CollateralPosition },
  supplyPositions: { [key in Address]: { [key in PoolTokenType]?: SupplyPosition } },
  borrowPositions: { [key in Address]: { [key in PoolTokenType]?: BorrowPosition } },
}

export interface TvlData {
  totalBalanceUSD: string;
  totalBorrowsUSD: string;
  totalSupplyUSD: string;
}

export interface AirdropData {
  index: number;
  amount: BigNumber;
  proof: Array<string>;
}

export interface ClaimEvent {
  amount: number;
  transactionHash: string;
}
