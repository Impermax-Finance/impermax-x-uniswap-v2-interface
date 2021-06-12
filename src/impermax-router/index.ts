// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import { Contract } from '@ethersproject/contracts';
import { Web3Provider } from '@ethersproject/providers';

import ERC20JSON from 'abis/contracts/IERC20.json';
import UniswapV2PairJSON from 'abis/contracts/IUniswapV2Pair.json';
import UniswapV2FactoryJSON from 'abis/contracts/IUniswapV2Factory.json';
import Router01JSON from 'abis/contracts/IRouter01.json';
import BorrowableJSON from 'abis/contracts/IBorrowable.json';
import CollateralSON from 'abis/contracts/ICollateral.json';
import FactoryJSON from 'abis/contracts/IFactory.json';
import SimpleUniswapOracleJSON from 'abis/contracts/ISimpleUniswapOracle.json';
import MerkleDistributorJSON from 'abis/contracts/IMerkleDistributor.json';
import FarmingPoolJSON from 'abis/contracts/IFarmingPool.json';
import ClaimAggregatorJSON from 'abis/contracts/ClaimAggregator.json';
import ClaimableJSON from 'abis/contracts/IClaimable.json';
import {
  Router,
  Address,
  LendingPool,
  PoolTokenType,
  ImpermaxRouterConfigInterface,
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
import Subgraph from 'subgraph';
import { ROUTER_ADDRESSES } from 'config/web3/contracts/router';
import { FACTORY_ADDRESSES } from 'config/web3/contracts/factory';
import { UNISWAP_V2_FACTORY_ADDRESSES } from 'config/web3/contracts/uniswap-v2-factory';
import { SIMPLE_UNISWAP_ORACLE_ADDRESSES } from 'config/web3/contracts/simple-uniswap-oracle';
import { MERKLE_DISTRIBUTOR_ADDRESSES } from 'config/web3/contracts/merkle-distributor-addresses';
import { CLAIM_AGGREGATOR_ADDRESSES } from 'config/web3/contracts/claim-aggregator-addresses';

class ImpermaxRouter {
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

  constructor(config: ImpermaxRouterConfigInterface) {
    this.subgraph = config.subgraph;
    this.library = config.library;
    this.chainId = config.chainId;
    this.uiMargin = 1.1;
    this.dust = 1.000001;
    this.router = this.newRouter(ROUTER_ADDRESSES[config.chainId]);
    this.factory = this.newFactory(FACTORY_ADDRESSES[config.chainId]);
    this.uniswapV2Factory = this.newUniswapV2Factory(UNISWAP_V2_FACTORY_ADDRESSES[config.chainId]);
    this.simpleUniswapOracle = this.newSimpleUniswapOracle(SIMPLE_UNISWAP_ORACLE_ADDRESSES[config.chainId]);
    this.merkleDistributor = this.newMerkleDistributor(MERKLE_DISTRIBUTOR_ADDRESSES[config.chainId]);
    this.claimAggregator = this.newClaimAggregator(CLAIM_AGGREGATOR_ADDRESSES[config.chainId]);
    this.priceInverted = config.priceInverted;
    this.lendingPoolCache = {};
    this.imxCache = {};
    this.claimableCache = {};
  }

  newRouter(address: Address): Contract {
    return new Contract(address, Router01JSON.abi, this.library.getSigner(this.account));
  }

  newFactory(address: Address): Contract {
    return new Contract(address, FactoryJSON.abi, this.library.getSigner(this.account));
  }

  newSimpleUniswapOracle(address: Address): Contract {
    return new Contract(address, SimpleUniswapOracleJSON.abi, this.library);
  }

  newUniswapV2Pair(address: Address): Contract {
    return new Contract(address, UniswapV2PairJSON.abi, this.library);
  }

  newUniswapV2Factory(address: Address): Contract {
    return new Contract(address, UniswapV2FactoryJSON.abi, this.library);
  }

  newERC20(address: Address): Contract {
    return new Contract(address, ERC20JSON.abi, this.library);
  }

  newCollateral(address: Address): Contract {
    return new Contract(address, CollateralSON.abi, this.library);
  }

  newBorrowable(address: Address): Contract {
    return new Contract(address, BorrowableJSON.abi, this.library);
  }

  newMerkleDistributor(address: Address): Contract {
    return new Contract(address, MerkleDistributorJSON.abi, this.library.getSigner(this.account));
  }

  newFarmingPool(address: Address): Contract {
    return new Contract(address, FarmingPoolJSON.abi, this.library);
  }

  newClaimAggregator(address: Address): Contract {
    return new Contract(address, ClaimAggregatorJSON.abi, this.library.getSigner(this.account));
  }

  newClaimable(address: Address): Contract {
    return new Contract(address, ClaimableJSON.abi, this.library.getSigner(this.account));
  }

  unlockWallet(library: Web3Provider, account: Address): void {
    this.library = library;
    this.account = account;
    this.router = this.newRouter(this.router.address);
    this.factory = this.newFactory(this.factory.address);
    this.simpleUniswapOracle = this.newSimpleUniswapOracle(this.simpleUniswapOracle.address);
    this.cleanCache();
  }

  cleanCache(): void {
    this.lendingPoolCache = {};
    this.imxCache = {};
    this.claimableCache = {};
  }

  setPriceInverted(priceInverted: boolean): void {
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

export default ImpermaxRouter;
