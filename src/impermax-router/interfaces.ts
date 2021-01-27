export type Address = string;
export type Contract = any;
export type Router = Contract;
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

export interface BorrowableBaseInfo {
  tokenAddress: Address;
  borrowableAddress: Address;
  name: string;
  symbol: string;
  decimals: number;
  totalBalance: number;
  totalBorrows: number;
  borrowRate: number;
}

export interface PoolTokenBalance {
  deposited: number;
  borrowed?: number;
}

export interface BorrowableData {
  tokenAddress: string;
  symbol: string;
  name: string;
  supplyUSD: number;
  borrowedUSD: number;
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
  //Todo
}

export interface AccountData {
  equityUSD: number;
  balanceUSD: number;
  debtUSD: number;
  riskMetrics: RiskMetrics;
  accountBorrowableAData: AccountBorrowableData;
  accountBorrowableBData: AccountBorrowableData;
  accountCollateralData: AccountCollateralData;
}

export interface ImpermaxRouterCfg {
  web3: any;
  routerAddress: Address;
  WETH: Address;
  convertToMainnet: Function;
}