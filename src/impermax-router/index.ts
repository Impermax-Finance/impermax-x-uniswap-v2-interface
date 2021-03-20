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
import MerkleDistributorJSON from '../abis/contracts/IMerkleDistributor.json';
import FarmingPoolJSON from '../abis/contracts/IFarmingPool.json';
import ClaimAggregatorJSON from '../abis/contracts/ClaimAggregator.json';
import ClaimableJSON from '../abis/contracts/IClaimable.json';
import { getPairConversionPrices, PairConversionPrices } from "../utils/valueConversion";
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
  Claimable
} from "./interfaces";
import * as contracts from "./contracts";
import * as fetchers from "./fetchers";
import * as borrowableFetchers from "./borrowableFetchers";
import * as utils from "./utils";
import * as approve from "./approve"
import * as interactions from "./interactions"
import * as account from "./account"
import * as imx from "./imx"
import { Networks } from "../utils/connections";

export default class ImpermaxRouter {
  web3: any;
  chainId: number;
  uiMargin: number;
  dust: number;
  library: any;
  router: Router;
  factory: Factory;
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
      safetyMargin?: Promise<number>,
      liquidationIncentive?: Promise<number>,
      reserves?: Promise<[number, number]>,
      LPTotalSupply?: Promise<number>,
      priceDenomLP?: Promise<[number, number]>,
      marketPrice?: Promise<number>,
      TWAPPrice?: Promise<number>,
      pairConversionPrices?: Promise<PairConversionPrices>,
      uniswapApy?: Promise<number>,
      availableReward?: Promise<number>,
      claimHistory?: Promise<ClaimEvent[]>,
      poolToken?: {
        [key in PoolTokenType]?: {
          name?: Promise<string>,
          symbol?: Promise<string>,
          decimals?: Promise<number>,
          exchangeRate?: Promise<number>,
          totalBalance?: Promise<number>,
          totalBorrows?: Promise<number>,
          borrowRate?: Promise<number>,
          reserveFactor?: Promise<number>, 
          kinkBorrowRate?: Promise<number>,
          kinkUtilizationRate?: Promise<number>,
          accrualTimestamp?: Promise<number>,
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
    this.web3 = cfg.web3;
    this.chainId = cfg.chainId;
    this.uiMargin = 1.1;
    this.dust = 1.000001;
    this.router = this.newRouter(cfg.routerAddress);
    this.factory = this.newFactory(cfg.factoryAddress);
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

  newRouter(address: Address) { return new this.web3.eth.Contract(Router01JSON.abi, address) }
  newFactory(address: Address) { return new this.web3.eth.Contract(FactoryJSON.abi, address) }
  newSimpleUniswapOracle(address: Address) { return new this.web3.eth.Contract(SimpleUniswapOracleJSON.abi, address) }
  newUniswapV2Pair(address: Address) { return new this.web3.eth.Contract(UniswapV2PairJSON.abi, address) }
  newERC20(address: Address) { return new this.web3.eth.Contract(ERC20JSON.abi, address) }
  newCollateral(address: Address) { return new this.web3.eth.Contract(CollateralSON.abi, address) }
  newBorrowable(address: Address) { return new this.web3.eth.Contract(BorrowableJSON.abi, address) }
  newMerkleDistributor(address: Address) { return new this.web3.eth.Contract(MerkleDistributorJSON.abi, address) }
  newFarmingPool(address: Address) { return new this.web3.eth.Contract(FarmingPoolJSON.abi, address) }
  newClaimAggregator(address: Address) { return new this.web3.eth.Contract(ClaimAggregatorJSON.abi, address) }
  newClaimable(address: Address) { return new this.web3.eth.Contract(ClaimableJSON.abi, address) }

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
  public initializeName = fetchers.initializeName;
  public initializeSymbol = fetchers.initializeSymbol;
  public initializeDecimals = fetchers.initializeDecimals;
  public initializeExchangeRate = fetchers.initializeExchangeRate;
  public initializeTotalBalance = fetchers.initializeTotalBalance;
  public initializeSafetyMargin = fetchers.initializeSafetyMargin;
  public initializeLiquidationIncentive = fetchers.initializeLiquidationIncentive;
  public initializeReserves = fetchers.initializeReserves;
  public initializeLPTotalSupply = fetchers.initializeLPTotalSupply;
  public initializePriceDenomLP = fetchers.initializePriceDenomLP;
  public initializeTWAPPrice = fetchers.initializeTWAPPrice;
  public getName = fetchers.getName;
  public getSymbol = fetchers.getSymbol;
  public getDecimals = fetchers.getDecimals;
  public getExchangeRate = fetchers.getExchangeRate;
  public getTotalBalance = fetchers.getTotalBalance;
  public getTotalBalanceUSD = fetchers.getTotalBalanceUSD;
  public getSafetyMargin = fetchers.getSafetyMargin;
  public getLiquidationIncentive = fetchers.getLiquidationIncentive;
  public getReserves = fetchers.getReserves;
  public getLPTotalSupply = fetchers.getLPTotalSupply;
  public getPriceDenomLP = fetchers.getPriceDenomLP;
  public getBorrowablePriceDenomLP = fetchers.getBorrowablePriceDenomLP;
  public getMarketPriceDenomLP = fetchers.getMarketPriceDenomLP;
  public getBorrowableMarketPriceDenomLP = fetchers.getBorrowableMarketPriceDenomLP;
  public getMarketPrice = fetchers.getMarketPrice;
  public getTWAPPrice = fetchers.getTWAPPrice;
  public getBorrowEvent = fetchers.getBorrowEvent;
  public getBorrowerList = fetchers.getBorrowerList;
  public getAccountLiquidity = fetchers.getAccountLiquidity;
  
  // Borrowable Fetchers
  public initializeReserveFactor = borrowableFetchers.initializeReserveFactor;
  public initializeKinkBorrowRate = borrowableFetchers.initializeKinkBorrowRate;
  public initializeKinkUtilizationRate = borrowableFetchers.initializeKinkUtilizationRate;
  public initializeAccrualTimestamp = borrowableFetchers.initializeAccrualTimestamp;
  public initializeBorrowRate = borrowableFetchers.initializeBorrowRate;
  public initializeTotalBorrows = borrowableFetchers.initializeTotalBorrows;
  public getReserveFactor = borrowableFetchers.getReserveFactor;
  public getKinkBorrowRate = borrowableFetchers.getKinkBorrowRate;
  public getKinkUtilizationRate = borrowableFetchers.getKinkUtilizationRate;
  public getAccrualTimestamp = borrowableFetchers.getAccrualTimestamp;
  public getTotalBorrows = borrowableFetchers.getTotalBorrows;
  public getCurrentTotalBorrows = borrowableFetchers.getCurrentTotalBorrows;
  public getTotalBorrowsUSD = borrowableFetchers.getTotalBorrowsUSD;
  public getBorrowRate = borrowableFetchers.getBorrowRate;
  public getBorrowAPY = borrowableFetchers.getBorrowAPY;
  public getNextBorrowRate = borrowableFetchers.getNextBorrowRate;
  public getNextBorrowAPY = borrowableFetchers.getNextBorrowAPY;
  public getSupply = borrowableFetchers.getSupply;
  public getCurrentSupply = borrowableFetchers.getCurrentSupply;
  public getSupplyUSD = borrowableFetchers.getSupplyUSD;
  public getUtilizationRate = borrowableFetchers.getUtilizationRate;
  public getSupplyRate = borrowableFetchers.getSupplyRate;
  public getSupplyAPY = borrowableFetchers.getSupplyAPY;
  public getNextSupplyRate = borrowableFetchers.getNextSupplyRate;
  public getNextSupplyAPY = borrowableFetchers.getNextSupplyAPY;

  // Account
  public initializeAvailableBalance = account.initializeAvailableBalance;
  public initializeBorrowed = account.initializeBorrowed;
  public initializeDeposited = account.initializeDeposited;
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
  public initializeRewardSpeed = imx.initializeRewardSpeed;
  public initializeFarmingShares = imx.initializeFarmingShares
  public initializeAvailableReward = imx.initializeAvailableReward;
  public initializeClaimHistory = imx.initializeClaimHistory;
  public initializeAvailableClaimable = imx.initializeAvailableClaimable;
  public getImxPrice = imx.getImxPrice;
  public getAirdropData = imx.getAirdropData;
  public hasClaimableAirdrop = imx.hasClaimableAirdrop;
  public getRewardSpeed = imx.getRewardSpeed;
  public getFarmingShares = imx.getFarmingShares;
  public getAvailableReward = imx.getAvailableReward;
  public getFarmingAPY = imx.getFarmingAPY;
  public getNextFarmingAPY = imx.getNextFarmingAPY;
  public getClaimHistory = imx.getClaimHistory;
  public getAvailableClaimable = imx.getAvailableClaimable;
  
  // Utils
  public normalize = utils.normalize;
  public getDeadline = utils.getDeadline;
  public toAPY = utils.toAPY;
  public initializePairConversionPricesRopsten = utils.initializePairConversionPricesRopsten;
  public getPairConversionPricesInternal = utils.getPairConversionPricesInternal;
  public getTokenPrice = utils.getTokenPrice;
  public getUniswapAPY = utils.getUniswapAPY;

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
}