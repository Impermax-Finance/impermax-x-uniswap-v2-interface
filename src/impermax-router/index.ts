import { provider } from "web3-core";
import { BigNumber, Contract, ethers, Overrides } from 'ethers';
import { decimalToBalance } from "../utils/ether-utils";

import ERC20JSON from '../abis/contracts/IERC20.json';
import UniswapV2PairJSON from '../abis/contracts/IUniswapV2Pair.json';
import Router01JSON from '../abis/contracts/IRouter01.json';
import BorrowableJSON from '../abis/contracts/IBorrowable.json';
import CollateralSON from '../abis/contracts/ICollateral.json';
import FactoryJSON from '../abis/contracts/IFactory.json';
import { getPairConversionPrices, PairConversionPrices } from "../utils/valueConversion";
import { 
  Router, 
  Address, 
  LendingPool, 
  PoolTokenType, 
  BorrowableBaseInfo, 
  PoolTokenBalance, 
  ImpermaxRouterCfg, 
  BorrowableData, 
  AccountBorrowableData, 
  AccountCollateralData, 
  AccountData 
} from "./interfaces";
import * as contracts from "./contracts";
import * as fetchers from "./fetchers";
import * as borrowableFetchers from "./borrowableFetchers";
import * as utils from "./utils";
import { deposit } from "./interactions"

export default class ImpermaxRouter {
  [x: string]: any;
  web3: any;
  router: Router;
  account: Address;
  WETH: Address;
  convertToMainnet: Function;
  lendingPoolCache: {
    [key in Address]?: {
      lendingPool?: Promise<LendingPool>,
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
      pairConversionPrices?: Promise<PairConversionPrices>,
    }
  };

  constructor(cfg: ImpermaxRouterCfg) {
    this.web3 = cfg.web3;
    this.router = this.newRouter(cfg.routerAddress);
    this.WETH = cfg.WETH;
    this.convertToMainnet = cfg.convertToMainnet;
    this.lendingPoolCache = {};
  }

  newRouter(address: Address) { return new this.web3.eth.Contract(Router01JSON.abi, address) }
  newFactory(address: Address) { return new this.web3.eth.Contract(FactoryJSON.abi, address) }
  newUniswapV2Pair(address: Address) { return new this.web3.eth.Contract(UniswapV2PairJSON.abi, address) }
  newERC20(address: Address) { return new this.web3.eth.Contract(ERC20JSON.abi, address) }
  newCollateral(address: Address) { return new this.web3.eth.Contract(CollateralSON.abi, address) }
  newBorrowable(address: Address) { return new this.web3.eth.Contract(BorrowableJSON.abi, address) }

  unlockWallet(web3: any, account: Address) {
    this.web3 = web3;
    this.account = account;
    this.router = this.newRouter(this.router._address);
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
  public initializeDeposited = fetchers.initializeDeposited;
  public getName = fetchers.getName;
  public getSymbol = fetchers.getSymbol;
  public getDecimals = fetchers.getDecimals;
  public getExchangeRate = fetchers.getExchangeRate;
  public getTotalBalance = fetchers.getTotalBalance;
  public getTotalBalanceUSD = fetchers.getTotalBalanceUSD;
  public getDeposited = fetchers.getDeposited;
  public getDepositedUSD = fetchers.getDepositedUSD;

  // Borrowable Fetchers
  public initializeBorrowRate = borrowableFetchers.initializeBorrowRate;
  public initializeTotalBorrows = borrowableFetchers.initializeTotalBorrows;
  public initializeBorrowed = borrowableFetchers.initializeBorrowed;
  public getTotalBorrows = borrowableFetchers.getTotalBorrows;
  public getTotalBorrowsUSD = borrowableFetchers.getTotalBorrowsUSD;
  public getBorrowRate = borrowableFetchers.getBorrowRate;
  public getBorrowed = borrowableFetchers.getBorrowed;
  public getBorrowedUSD = borrowableFetchers.getBorrowedUSD;
  public getSupply = borrowableFetchers.getSupply;
  public getSupplyUSD = borrowableFetchers.getSupplyUSD;
  public getUtilizationRate = borrowableFetchers.getUtilizationRate;
  public getSupplyRate = borrowableFetchers.getSupplyRate;

  // Utils
  public normalize = utils.normalize;
  public getDeadline = utils.getDeadline;
  public toAPY = utils.toAPY;
  public getPairConversionPricesInternal = utils.getPairConversionPricesInternal;
  public getTokenPrice = utils.getTokenPrice;

  // Interactions
  public deposit = deposit;
  


  async getBorrowableData(uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<BorrowableData> {
    return {
      tokenAddress: await this.getTokenAddress(uniswapV2PairAddress, poolTokenType),
      symbol: await this.getSymbol(uniswapV2PairAddress, poolTokenType),
      name: await this.getName(uniswapV2PairAddress, poolTokenType),
      supplyUSD: await this.getSupplyUSD(uniswapV2PairAddress, poolTokenType),
      borrowedUSD: await this.getTotalBorrowsUSD(uniswapV2PairAddress, poolTokenType),
      utilizationRate: await this.getUtilizationRate(uniswapV2PairAddress, poolTokenType),
      supplyAPY: this.toAPY(await this.getSupplyRate(uniswapV2PairAddress, poolTokenType)),
      borrowAPY: this.toAPY(await this.getBorrowRate(uniswapV2PairAddress, poolTokenType))
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
    const dataA = await this.getAccountBorrowableData(uniswapV2PairAddress, PoolTokenType.BorrowableA);
    const dataB = await this.getAccountBorrowableData(uniswapV2PairAddress, PoolTokenType.BorrowableB);
    const dataCollateral = await this.getAccountCollateralData(uniswapV2PairAddress);
    const balanceUSD = dataA.depositedUSD + dataB.depositedUSD + dataCollateral.depositedUSD;
    const debtUSD = dataA.borrowedUSD + dataB.borrowedUSD;
    const equityUSD = balanceUSD - debtUSD;
    return {
      equityUSD: equityUSD,
      balanceUSD: balanceUSD,
      debtUSD: debtUSD,
      riskMetrics: {},
      accountBorrowableAData: dataA,
      accountBorrowableBData: dataB,
      accountCollateralData: dataCollateral,
    }
  }
}