import { provider } from "web3-core";
import { BigNumber, Contract, ethers, Overrides } from 'ethers';
import { decimalToBalance } from "../utils/ether-utils";

import ERC20JSON from '../abis/contracts/IERC20.json';
import UniswapV2PairJSON from '../abis/contracts/IUniswapV2Pair.json';
import Router01JSON from '../abis/contracts/IRouter01.json';
import BorrowableJSON from '../abis/contracts/IBorrowable.json';
import CollateralSON from '../abis/contracts/ICollateral.json';
import FactoryJSON from '../abis/contracts/IFactory.json';
import SimpleUniswapOracleJSON from '../abis/contracts/ISimpleUniswapOracle.json';
import { getPairConversionPrices, PairConversionPrices } from "../utils/valueConversion";
import { 
  Router,
  Address,
  LendingPool,
  PoolTokenType,
  ImpermaxRouterCfg,
  BorrowableData, 
  AccountBorrowableData, 
  AccountCollateralData, 
  AccountData, 
  Factory,
  SimpleUniswapOracle
} from "./interfaces";
import * as contracts from "./contracts";
import * as fetchers from "./fetchers";
import * as borrowableFetchers from "./borrowableFetchers";
import * as utils from "./utils";
import * as interactions from "./interactions"
import * as account from "./account"
import { Networks } from "../utils/connections";

export default class ImpermaxRouter {
  [x: string]: any;
  web3: any;
  chainId: number;
  router: Router;
  factory: Factory;
  simpleUniswapOracle: SimpleUniswapOracle;
  account: Address;
  WETH: Address;
  convertToMainnet: Function;
  lendingPoolCache: {
    [key in Address]?: {
      lendingPool?: Promise<LendingPool>,
      safetyMargin?: Promise<number>,
      liquidationIncentive?: Promise<number>,
      priceDenomLP?: Promise<[number, number]>,
      marketPrice?: Promise<number>,
      TWAPPrice?: Promise<number>,
      pairConversionPrices?: Promise<PairConversionPrices>,
      poolToken?: {
        [key in PoolTokenType]?: {
          name?: Promise<string>,
          symbol?: Promise<string>,
          decimals?: Promise<number>,
          exchangeRate?: Promise<number>,
          totalBalance?: Promise<number>,
          totalBorrows?: Promise<number>,
          borrowRate?: Promise<number>,
          deposited?: Promise<number>,
          borrowed?: Promise<number>,
        }
      },
    }
  };

  constructor(cfg: ImpermaxRouterCfg) {
    this.web3 = cfg.web3;
    this.chainId = cfg.chainId;
    this.router = this.newRouter(cfg.routerAddress);
    this.factory = this.newFactory(cfg.factoryAddress);
    this.simpleUniswapOracle = this.newSimpleUniswapOracle(cfg.simpleUniswapOracleAddress);
    this.WETH = cfg.WETH;
    this.convertToMainnet = cfg.convertToMainnet;
    this.lendingPoolCache = {};
  }

  newRouter(address: Address) { return new this.web3.eth.Contract(Router01JSON.abi, address) }
  newFactory(address: Address) { return new this.web3.eth.Contract(FactoryJSON.abi, address) }
  newSimpleUniswapOracle(address: Address) { return new this.web3.eth.Contract(SimpleUniswapOracleJSON.abi, address) }
  newUniswapV2Pair(address: Address) { return new this.web3.eth.Contract(UniswapV2PairJSON.abi, address) }
  newERC20(address: Address) { return new this.web3.eth.Contract(ERC20JSON.abi, address) }
  newCollateral(address: Address) { return new this.web3.eth.Contract(CollateralSON.abi, address) }
  newBorrowable(address: Address) { return new this.web3.eth.Contract(BorrowableJSON.abi, address) }

  async unlockWallet(web3: any, account: Address) {
    this.web3 = web3;
    this.account = account;
    this.router = this.newRouter(this.router._address);
    this.factory = this.newFactory(this.factory._address);
    this.simpleUniswapOracle = this.newSimpleUniswapOracle(this.simpleUniswapOracle._address);
    this.lendingPoolCache = {};
  }

  // Contracts
  public initializeLendingPool = contracts.initializeLendingPool;
  public getLendingPoolCache = contracts.getLendingPoolCache;
  public getLendingPool = contracts.getLendingPool;
  public getContracts = contracts.getContracts;
  public getPoolTokenAddress = contracts.getPoolTokenAddress;
  public getTokenAddress = contracts.getTokenAddress;
  
  // Fetchers
  public getPoolTokenCache = fetchers.getPoolTokenCache;
  public initializeName = fetchers.initializeName;
  public initializeSymbol = fetchers.initializeSymbol;
  public initializeDecimals = fetchers.initializeDecimals;
  public initializeExchangeRate = fetchers.initializeExchangeRate;
  public initializeTotalBalance = fetchers.initializeTotalBalance;
  public initializeSafetyMargin = fetchers.initializeSafetyMargin;
  public initializeLiquidationIncentive = fetchers.initializeLiquidationIncentive;
  public initializePriceDenomLP = fetchers.initializePriceDenomLP;
  public initializeMarketPrice = fetchers.initializeMarketPrice;
  public initializeTWAPPrice = fetchers.initializeTWAPPrice;
  public getName = fetchers.getName;
  public getSymbol = fetchers.getSymbol;
  public getDecimals = fetchers.getDecimals;
  public getExchangeRate = fetchers.getExchangeRate;
  public getTotalBalance = fetchers.getTotalBalance;
  public getTotalBalanceUSD = fetchers.getTotalBalanceUSD;
  public getSafetyMargin = fetchers.getSafetyMargin;
  public getLiquidationIncentive = fetchers.getLiquidationIncentive;
  public getPriceDenomLP = fetchers.getPriceDenomLP;
  public getMarketPrice = fetchers.getMarketPrice;
  public getTWAPPrice = fetchers.getTWAPPrice;

  // Borrowable Fetchers
  public initializeBorrowRate = borrowableFetchers.initializeBorrowRate;
  public initializeTotalBorrows = borrowableFetchers.initializeTotalBorrows;
  public getTotalBorrows = borrowableFetchers.getTotalBorrows;
  public getTotalBorrowsUSD = borrowableFetchers.getTotalBorrowsUSD;
  public getBorrowRate = borrowableFetchers.getBorrowRate;
  public getBorrowAPY = borrowableFetchers.getBorrowAPY;
  public getSupply = borrowableFetchers.getSupply;
  public getSupplyUSD = borrowableFetchers.getSupplyUSD;
  public getUtilizationRate = borrowableFetchers.getUtilizationRate;
  public getSupplyRate = borrowableFetchers.getSupplyRate;
  public getSupplyAPY = borrowableFetchers.getSupplyAPY;

  // Account
  public initializeBorrowed = account.initializeBorrowed;
  public initializeDeposited = account.initializeDeposited;
  public getBorrowed = account.getBorrowed;
  public getBorrowedUSD = account.getBorrowedUSD;
  public getDeposited = account.getDeposited;
  public getDepositedUSD = account.getDepositedUSD;
  public getBalanceUSD = account.getBalanceUSD;
  public getDebtUSD = account.getDebtUSD;
  public getEquityUSD = account.getEquityUSD;
  public getLeverage = account.getLeverage;
  public getLiquidationPriceSwings = account.getLiquidationPriceSwings;
  public getLiquidationPrices = account.getLiquidationPrices;

  // Utils
  public normalize = utils.normalize;
  public getDeadline = utils.getDeadline;
  public toAPY = utils.toAPY;
  public initializePairConversionPricesRopsten = utils.initializePairConversionPricesRopsten;
  public getPairConversionPricesInternal = utils.getPairConversionPricesInternal;
  public getTokenPrice = utils.getTokenPrice;

  // Interactions
  public deposit = interactions.deposit;
  public borrow = interactions.borrow;
  

  async getBorrowableData(uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<BorrowableData> {
    return {
      tokenAddress: await this.getTokenAddress(uniswapV2PairAddress, poolTokenType),
      symbol: await this.getSymbol(uniswapV2PairAddress, poolTokenType),
      name: await this.getName(uniswapV2PairAddress, poolTokenType),
      supplyUSD: await this.getSupplyUSD(uniswapV2PairAddress, poolTokenType),
      totalBorrowsUSD: await this.getTotalBorrowsUSD(uniswapV2PairAddress, poolTokenType),
      utilizationRate: await this.getUtilizationRate(uniswapV2PairAddress, poolTokenType),
      supplyAPY: await this.getSupplyAPY(uniswapV2PairAddress, poolTokenType),
      borrowAPY: await this.getBorrowAPY(uniswapV2PairAddress, poolTokenType),
    };
  }

  async getAccountBorrowableData(uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<AccountBorrowableData> {
    if (!this.account) return null;
    return {
      tokenAddress: await this.getTokenAddress(uniswapV2PairAddress, poolTokenType),
      borrowableAddress: await this.getPoolTokenAddress(uniswapV2PairAddress, poolTokenType),
      symbol: await this.getSymbol(uniswapV2PairAddress, poolTokenType),
      decimals: await this.getDecimals(uniswapV2PairAddress, poolTokenType),
      borrowed: await this.getBorrowed(uniswapV2PairAddress, poolTokenType),
      borrowedUSD: await this.getBorrowedUSD(uniswapV2PairAddress, poolTokenType),
      deposited: await this.getDeposited(uniswapV2PairAddress, poolTokenType),
      depositedUSD: await this.getDepositedUSD(uniswapV2PairAddress, poolTokenType),
    };
  }

  async getAccountCollateralData(uniswapV2PairAddress: Address) : Promise<AccountCollateralData> {
    if (!this.account) return null;
    return {
      tokenAAddress: await this.getTokenAddress(uniswapV2PairAddress, PoolTokenType.BorrowableA),
      tokenBAddress: await this.getTokenAddress(uniswapV2PairAddress, PoolTokenType.BorrowableB),
      collateralAddress: await this.getPoolTokenAddress(uniswapV2PairAddress, PoolTokenType.Collateral),
      symbolA: await this.getSymbol(uniswapV2PairAddress, PoolTokenType.BorrowableA),
      symbolB: await this.getSymbol(uniswapV2PairAddress, PoolTokenType.BorrowableB),
      decimals: 18,
      deposited: await this.getDeposited(uniswapV2PairAddress, PoolTokenType.Collateral),
      depositedUSD: await this.getDepositedUSD(uniswapV2PairAddress, PoolTokenType.Collateral),
    };
  }

  async getAccountData(uniswapV2PairAddress: Address) : Promise<AccountData> {
    if (!this.account) return null;
    return {
      symbolA: await this.getSymbol(uniswapV2PairAddress, PoolTokenType.BorrowableA),
      symbolB: await this.getSymbol(uniswapV2PairAddress, PoolTokenType.BorrowableB),
      equityUSD: await this.getEquityUSD(uniswapV2PairAddress),
      balanceUSD: await this.getBalanceUSD(uniswapV2PairAddress),
      debtUSD: await this.getDebtUSD(uniswapV2PairAddress),
      riskMetrics: {
        leverage: await this.getLeverage(uniswapV2PairAddress),
        liquidationPrices: await this.getLiquidationPrices(uniswapV2PairAddress),
        marketPrice: await this.getMarketPrice(uniswapV2PairAddress),
        TWAPPrice: await this.getTWAPPrice(uniswapV2PairAddress),
      },
    }
  }
}