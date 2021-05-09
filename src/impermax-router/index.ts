// ray test touch <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// ray test touch >

import ERC20JSON from '../abis/contracts/IERC20.json';
import UniswapV2PairJSON from '../abis/contracts/IUniswapV2Pair.json';
import UniswapV2FactoryJSON from '../abis/contracts/IUniswapV2Factory.json';
import Router01JSON from '../abis/contracts/IRouter01.json';
import BorrowableJSON from '../abis/contracts/IBorrowable.json';
import CollateralSON from '../abis/contracts/ICollateral.json';
import FactoryJSON from '../abis/contracts/IFactory.json';
import SimpleUniswapOracleJSON from '../abis/contracts/ISimpleUniswapOracle.json';
import MerkleDistributorJSON from '../abis/contracts/IMerkleDistributor.json';
import FarmingPoolJSON from '../abis/contracts/IFarmingPool.json';
import ClaimAggregatorJSON from '../abis/contracts/ClaimAggregator.json';
import ClaimableJSON from '../abis/contracts/IClaimable.json';
import {
  Router,
  Address,
  LendingPool,
  PoolTokenType,
  ImpermaxRouterCfg,
  Factory,
  SimpleUniswapOracle,
  AirdropData,
  MerkleDistributor,
  ClaimAggregator,
  ClaimEvent,
  Claimable,
  UniswapV2Factory
} from './interfaces';
import * as contracts from './contracts';
import * as fetchers from './fetchers';
import * as utils from './utils';
import * as approve from './approve';
import * as interactions from './interactions';
import * as account from './account';
import * as imx from './imx';
import Subgraph from '../subgraph';

export default class ImpermaxRouter {
  subgraph: Subgraph;
  web3: any;
  chainId: number;
  uiMargin: number;
  dust: number;
  router: Router;
  factory: Factory;
  uniswapV2Factory: UniswapV2Factory;
  simpleUniswapOracle: SimpleUniswapOracle;
  merkleDistributor: MerkleDistributor;
  claimAggregator: ClaimAggregator;
  account: Address;
  IMX: Address;
  WETH: Address;
  airdropUrl: string;
  priceInverted: boolean;
  lendingPoolCache: {
    [key in Address]?: {
      lendingPool?: Promise<LendingPool>,
      reserves?: Promise<[number, number]>,
      LPTotalSupply?: Promise<number>,
      marketPrice?: Promise<number>,
      priceDenomLP?: Promise<[number, number]>,
      TWAPPrice?: Promise<number>,
      availableReward?: Promise<number>,
      claimHistory?: Promise<ClaimEvent[]>,
      poolToken?: {
        [key in PoolTokenType]?: {
          exchangeRate?: Promise<number>,
          availableBalance?: Promise<number>,
          deposited?: Promise<number>,
          borrowed?: Promise<number>,
          rewardSpeed?: Promise<number>,
          farmingShares?: Promise<number>,
        }
      },
    }
  };
  imxCache: {
    airdropData?: AirdropData,
  };
  claimableCache: {
    [key in Address]?: {
      contract?: Claimable,
      availableClaimable?: number,
    }
  };

  constructor(cfg: ImpermaxRouterCfg) {
    this.subgraph = cfg.subgraph;
    this.web3 = cfg.web3;
    this.chainId = cfg.chainId;
    this.uiMargin = 1.1;
    this.dust = 1.000001;
    this.router = this.newRouter(cfg.routerAddress);
    this.factory = this.newFactory(cfg.factoryAddress);
    this.uniswapV2Factory = this.newUniswapV2Factory(cfg.uniswapV2FactoryAddress);
    this.simpleUniswapOracle = this.newSimpleUniswapOracle(cfg.simpleUniswapOracleAddress);
    this.merkleDistributor = this.newMerkleDistributor(cfg.merkleDistributorAddress);
    this.claimAggregator = this.newClaimAggregator(cfg.claimAggregatorAddress);
    this.IMX = cfg.IMX;
    this.WETH = cfg.WETH;
    this.airdropUrl = cfg.airdropUrl;
    this.priceInverted = cfg.priceInverted;
    this.lendingPoolCache = {};
    this.imxCache = {};
    this.claimableCache = {};
  }

  newRouter(address: Address) {
    return new this.web3.eth.Contract(Router01JSON.abi, address);
  }
  newFactory(address: Address) {
    return new this.web3.eth.Contract(FactoryJSON.abi, address);
  }
  newSimpleUniswapOracle(address: Address) {
    return new this.web3.eth.Contract(SimpleUniswapOracleJSON.abi, address);
  }
  newUniswapV2Pair(address: Address) {
    return new this.web3.eth.Contract(UniswapV2PairJSON.abi, address);
  }
  newUniswapV2Factory(address: Address) {
    return new this.web3.eth.Contract(UniswapV2FactoryJSON.abi, address);
  }
  newERC20(address: Address) {
    return new this.web3.eth.Contract(ERC20JSON.abi, address);
  }
  newCollateral(address: Address) {
    return new this.web3.eth.Contract(CollateralSON.abi, address);
  }
  newBorrowable(address: Address) {
    return new this.web3.eth.Contract(BorrowableJSON.abi, address);
  }
  newMerkleDistributor(address: Address) {
    return new this.web3.eth.Contract(MerkleDistributorJSON.abi, address);
  }
  newFarmingPool(address: Address) {
    return new this.web3.eth.Contract(FarmingPoolJSON.abi, address);
  }
  newClaimAggregator(address: Address) {
    return new this.web3.eth.Contract(ClaimAggregatorJSON.abi, address);
  }
  newClaimable(address: Address) {
    return new this.web3.eth.Contract(ClaimableJSON.abi, address);
  }

  async unlockWallet(web3: any, account: Address) {
    this.web3 = web3;
    this.account = account;
    this.router = this.newRouter(this.router._address);
    this.factory = this.newFactory(this.factory._address);
    this.simpleUniswapOracle = this.newSimpleUniswapOracle(this.simpleUniswapOracle._address);
    this.cleanCache();
  }

  cleanCache() {
    this.lendingPoolCache = {};
    this.imxCache = {};
    this.claimableCache = {};
  }

  setPriceInverted(priceInverted: boolean) {
    this.priceInverted = priceInverted;
  }

  // Contracts
  public initializeLendingPool = contracts.initializeLendingPool;
  public initializeClaimable = contracts.initializeClaimable;
  public getLendingPoolCache = contracts.getLendingPoolCache;
  public getClaimableCache = contracts.getClaimableCache;
  public getLendingPool = contracts.getLendingPool;
  public getContracts = contracts.getContracts;
  public getPoolToken = contracts.getPoolToken;
  public getToken = contracts.getToken;
  public getFarmingPool = contracts.getFarmingPool;
  public getClaimable = contracts.getClaimable;
  public getPoolTokenAddress = contracts.getPoolTokenAddress;
  public getTokenAddress = contracts.getTokenAddress;

  // Fetchers
  public getPoolTokenCache = fetchers.getPoolTokenCache;
  public initializeReserves = fetchers.initializeReserves;
  public initializeLPTotalSupply = fetchers.initializeLPTotalSupply;
  public initializePriceDenomLP = fetchers.initializePriceDenomLP;
  public initializeTWAPPrice = fetchers.initializeTWAPPrice;
  public getReserves = fetchers.getReserves;
  public getLPTotalSupply = fetchers.getLPTotalSupply;
  public getPriceDenomLP = fetchers.getPriceDenomLP;
  public getBorrowablePriceDenomLP = fetchers.getBorrowablePriceDenomLP;
  public getMarketPriceDenomLP = fetchers.getMarketPriceDenomLP;
  public getBorrowableMarketPriceDenomLP = fetchers.getBorrowableMarketPriceDenomLP;
  public getMarketPrice = fetchers.getMarketPrice;
  public getTWAPPrice = fetchers.getTWAPPrice;
  public isValidPair = fetchers.isValidPair;
  public getPairSymbols = fetchers.getPairSymbols;
  public isPoolTokenCreated = fetchers.isPoolTokenCreated;
  public isPairInitialized = fetchers.isPairInitialized;

  // Account
  public initializeExchangeRate = account.initializeExchangeRate;
  public initializeAvailableBalance = account.initializeAvailableBalance;
  public initializeBorrowed = account.initializeBorrowed;
  public initializeDeposited = account.initializeDeposited;
  public getExchangeRate = account.getExchangeRate;
  public getAvailableBalance = account.getAvailableBalance;
  public getAvailableBalanceUSD = account.getAvailableBalanceUSD;
  public getBorrowed = account.getBorrowed;
  public getBorrowedUSD = account.getBorrowedUSD;
  public getDeposited = account.getDeposited;
  public getDepositedUSD = account.getDepositedUSD;
  public getBalanceUSD = account.getBalanceUSD;
  public getSuppliedUSD = account.getSuppliedUSD;
  public getDebtUSD = account.getDebtUSD;
  public getEquityUSD = account.getEquityUSD;
  public getLPEquityUSD = account.getLPEquityUSD;
  public getAccountAPY = account.getAccountAPY;
  public getValuesFromPrice = account.getValuesFromPrice;
  public getValues = account.getValues;
  public getMarketValues = account.getMarketValues;
  public getNewLeverage = account.getNewLeverage;
  public getNewLiquidationPriceSwings = account.getNewLiquidationPriceSwings;
  public getNewLiquidationPrices = account.getNewLiquidationPrices;
  public getLeverage = account.getLeverage;
  public getLiquidationPriceSwings = account.getLiquidationPriceSwings;
  public getLiquidationPrices = account.getLiquidationPrices;
  public getMaxWithdrawable = account.getMaxWithdrawable;
  public getMaxBorrowable = account.getMaxBorrowable;
  public getMaxLeverage = account.getMaxLeverage;
  public getMaxDeleverage = account.getMaxDeleverage;

  // IMX
  public initializeAirdropData = imx.initializeAirdropData;
  public initializeFarmingShares = imx.initializeFarmingShares
  public initializeAvailableReward = imx.initializeAvailableReward;
  public initializeClaimHistory = imx.initializeClaimHistory;
  public initializeAvailableClaimable = imx.initializeAvailableClaimable;
  public getAirdropData = imx.getAirdropData;
  public hasClaimableAirdrop = imx.hasClaimableAirdrop;
  public getFarmingShares = imx.getFarmingShares;
  public getAvailableReward = imx.getAvailableReward;
  public getClaimHistory = imx.getClaimHistory;
  public getAvailableClaimable = imx.getAvailableClaimable;

  // Utils
  public normalize = utils.normalize;
  public getDeadline = utils.getDeadline;
  public toAPY = utils.toAPY;

  // Approve
  public getOwnerSpender = approve.getOwnerSpender;
  public approve = approve.approve;
  public getAllowance = approve.getAllowance;
  public getPermitData = approve.getPermitData;

  // Interactions
  public deposit = interactions.deposit;
  public withdraw = interactions.withdraw;
  public borrow = interactions.borrow;
  public repay = interactions.repay;
  public getLeverageAmounts = interactions.getLeverageAmounts;
  public leverage = interactions.leverage;
  public getDeleverageAmounts = interactions.getDeleverageAmounts;
  public deleverage = interactions.deleverage;
  public claimAirdrop = interactions.claimAirdrop;
  public trackBorrows = interactions.trackBorrows;
  public claims = interactions.claims;
  public claimDistributor = interactions.claimDistributor;
  public createNewPair = interactions.createNewPair;
}
