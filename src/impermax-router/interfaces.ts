import { Networks } from "../utils/connections";
import { BigNumber } from "ethers";

export type Address = string;
export type Contract = any;
export type Router = Contract;
export type Factory = Contract;
export type SimpleUniswapOracle = Contract;
export type ERC20 = Contract;
export type UniswapV2Pair = Contract;
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
  BorrowableA = 'borrowableA',
  BorrowableB = 'borrowableB',
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
  changeCollateral: 0,
}

export interface ImpermaxRouterCfg {
  web3: any;
  chainId: number;
  routerAddress: Address;
  factoryAddress: Address;
  simpleUniswapOracleAddress: Address;
  merkleDistributorAddress: Address;
  claimAggregatorAddress: Address;
  IMX: Address;
  WETH: Address;
  airdropUrl: string;
  priceInverted: boolean;
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