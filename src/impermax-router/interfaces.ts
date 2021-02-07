import { Networks } from "../utils/connections";

export type Address = string;
export type Contract = any;
export type Router = Contract;
export type Factory = Contract;
export type SimpleUniswapOracle = Contract;
export type ERC20 = Contract;
export type UniswapV2Pair = Contract;
export type Borrowable = Contract;
export type Collateral = Contract;

export type LendingPool = {
  uniswapV2Pair: UniswapV2Pair,
  tokenA: ERC20,
  tokenB: ERC20,
  collateral: Collateral,
  borrowableA: Borrowable,
  borrowableB: Borrowable,
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

export interface BorrowableData {
  tokenAddress: string;
  symbol: string;
  name: string;
  supplyUSD: number;
  totalBorrowsUSD: number;
  utilizationRate: number;
  supplyAPY: number;
  borrowAPY: number;
  //farmingAPY: number;
}

export interface AccountBorrowableData {
  tokenAddress: string;
  borrowableAddress: string;
  symbol: string;
  decimals: number;
  borrowed: number;
  borrowedUSD: number;
  deposited: number;
  depositedUSD: number;
}

export interface AccountCollateralData {
  tokenAAddress: string;
  tokenBAddress: string;
  collateralAddress: string;
  symbolA: string;
  symbolB: string;
  decimals: number;
  deposited: number;
  depositedUSD: number;
}

export interface RiskMetrics {
  leverage: number;
  liquidationPrices: [number, number];
  marketPrice: number;
  TWAPPrice: number;
  safetyMargin: number;
}

export interface AccountData {
  symbolA: string;
  symbolB: string;
  equityUSD: number;
  balanceUSD: number;
  debtUSD: number;
  riskMetrics: RiskMetrics;
}

export interface ImpermaxRouterCfg {
  web3: any;
  chainId: number;
  routerAddress: Address;
  factoryAddress: Address;
  simpleUniswapOracleAddress: Address;
  WETH: Address;
  convertToMainnet: Function;
  priceInverted: boolean;
}