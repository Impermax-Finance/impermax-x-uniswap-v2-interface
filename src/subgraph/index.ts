// ray test touch <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// ray test touch >

import { LendingPoolData, Address, TvlData, UserData } from '../impermax-router/interfaces';

import * as initializer from './initializer';
import * as cacheData from './cacheData';
import * as utils from './utils';
import * as account from './account';

export interface SubgraphCfg {
  impermaxSubgraphUrl: string;
  chainId: number;
  IMX: Address;
  WETH: Address;
  uniswapV2FactoryAddress: Address;
}

export default class Subgraph {
  impermaxSubgraphUrl: string;
  uniswapSubgraphUrl: string;
  blocklyticsSubgraphUrl: string;
  chainId: number;
  IMX: Address;
  WETH: Address;
  uniswapV2FactoryAddress: Address;
  lendingPoolsData: Promise<{
    [key in Address]?: LendingPoolData
  }>;
  usersData: {
    [key in Address]?: Promise<UserData>
  };
  tvlData: Promise<TvlData>

  constructor(cfg: SubgraphCfg) {
    this.impermaxSubgraphUrl = cfg.impermaxSubgraphUrl;
    this.uniswapSubgraphUrl = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2';
    this.blocklyticsSubgraphUrl = 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks';
    this.chainId = cfg.chainId;
    this.IMX = cfg.IMX;
    this.WETH = cfg.WETH;
    this.uniswapV2FactoryAddress = cfg.uniswapV2FactoryAddress;
    this.usersData = {};
  }

  cleanCache() {
    this.lendingPoolsData = null;
    this.usersData = null;
    this.tvlData = null;
  }

  // Fetchers
  public apolloFetcher = initializer.apolloFetcher;
  public fetchLendingPools = initializer.fetchLendingPools;
  public fetchPastVolume = initializer.fetchPastVolume;
  public fetchCurrentVolumeAndReserves = initializer.fetchCurrentVolumeAndReserves;
  public fetchUniswapAPY = initializer.fetchUniswapAPY;
  public fetchBlockByTimestamp = initializer.fetchBlockByTimestamp;
  public initializeLendingPoolsData = initializer.initializeLendingPoolsData;
  public getLendingPoolsData = initializer.getLendingPoolsData;
  public getLendingPoolData = initializer.getLendingPoolData;
  public initializeTvlData = initializer.initializeTvlData;
  public getTvlData = initializer.getTvlData;
  public fetchUserData = initializer.fetchUserData;
  public initializeUserData = initializer.initializeUserData;
  public getUserData = initializer.getUserData;

  // Data Getters
  public getPairList = cacheData.getPairList;
  public getName = cacheData.getName;
  public getSymbol = cacheData.getSymbol;
  public getDecimals = cacheData.getDecimals;
  public getExchangeRate = cacheData.getExchangeRate;
  public getUnderlyingAddress = cacheData.getUnderlyingAddress;
  public getTokenPrice = cacheData.getTokenPrice;
  public getImxPrice = cacheData.getImxPrice;
  public getTotalBalance = cacheData.getTotalBalance;
  public getTotalBalanceUSD = cacheData.getTotalBalanceUSD;
  public getSafetyMargin = cacheData.getSafetyMargin;
  public getLiquidationIncentive = cacheData.getLiquidationIncentive;
  public getReserveFactor = cacheData.getReserveFactor;
  public getKinkBorrowRate = cacheData.getKinkBorrowRate;
  public getKinkUtilizationRate = cacheData.getKinkUtilizationRate;
  public getBorrowIndex = cacheData.getBorrowIndex;
  public getAccrualTimestamp = cacheData.getAccrualTimestamp;
  public getTotalBorrows = cacheData.getTotalBorrows;
  public getCurrentTotalBorrows = cacheData.getCurrentTotalBorrows;
  public getTotalBorrowsUSD = cacheData.getTotalBorrowsUSD;
  public getBorrowRate = cacheData.getBorrowRate;
  public getBorrowAPY = cacheData.getBorrowAPY;
  public getNextBorrowRate = cacheData.getNextBorrowRate;
  public getNextBorrowAPY = cacheData.getNextBorrowAPY;
  public getSupply = cacheData.getSupply;
  public getCurrentSupply = cacheData.getCurrentSupply;
  public getSupplyUSD = cacheData.getSupplyUSD;
  public getUtilizationRate = cacheData.getUtilizationRate;
  public getSupplyRate = cacheData.getSupplyRate;
  public getSupplyAPY = cacheData.getSupplyAPY;
  public getNextSupplyRate = cacheData.getNextSupplyRate;
  public getNextSupplyAPY = cacheData.getNextSupplyAPY;
  public getUniswapAPY = cacheData.getUniswapAPY;
  public getTotalValueLocked = cacheData.getTotalValueLocked;
  public getTotalValueSupplied = cacheData.getTotalValueSupplied;
  public getTotalValueBorrowed = cacheData.getTotalValueBorrowed;
  public getRewardSpeed = cacheData.getRewardSpeed;
  public getFarmingAPY = cacheData.getFarmingAPY;
  public getNextFarmingAPY = cacheData.getNextFarmingAPY;

  // Account
  public getBorrowPositions = account.getBorrowPositions;
  public getSupplyPositions = account.getSupplyPositions;
  public getCollateralAmount = account.getCollateralAmount;
  public getCollateralValue = account.getCollateralValue;
  public getBorrowedAmount = account.getBorrowedAmount;
  public getBorrowedValue = account.getBorrowedValue;
  public getBorrowerEquityValue = account.getBorrowerEquityValue;
  public getSuppliedAmount = account.getSuppliedAmount;
  public getSuppliedValue = account.getSuppliedValue;
  public getAccountTotalValueLocked = account.getAccountTotalValueLocked;
  public getAccountTotalValueSupplied = account.getAccountTotalValueSupplied;
  public getAccountTotalValueBorrowed = account.getAccountTotalValueBorrowed;

  // Utils
  public toAPY = utils.toAPY;
  public getPairAddress = utils.getPairAddress;
}
