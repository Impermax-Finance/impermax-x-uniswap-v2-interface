import { provider } from "web3-core";
import { BigNumber, Contract, ethers, Overrides } from 'ethers';
import { decimalToBalance } from "../utils/ether-utils";

import ERC20JSON from '../abis/contracts/IERC20.json';
import UniswapV2PairJSON from '../abis/contracts/IUniswapV2Pair.json';
import Router01JSON from '../abis/contracts/IRouter01.json';
import BorrowableJSON from '../abis/contracts/IBorrowable.json';
import CollateralSON from '../abis/contracts/ICollateral.json';
import FactoryJSON from '../abis/contracts/IFactory.json';
import { getPairConversionPrices } from "../utils/valueConversion";

export type Address = string;
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

export enum PoolToken {
  Collateral = 'collateral',
  BorrowableA = 'borrowableA',
  BorrowableB = 'borrowableB',
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
 
export default class ImpermaxRouter {
  web3: any;
  router: Router;
  account: Address;
  WETH: Address;
  convertToMainnet: Function;
  lendingPool: {
    [key in Address]: Promise<LendingPool>
  };

  constructor(cfg: ImpermaxRouterCfg) {
    this.web3 = cfg.web3;
    this.router = this.newRouter(cfg.routerAddress);
    this.WETH = cfg.WETH;
    this.convertToMainnet = cfg.convertToMainnet;
    this.lendingPool = {};
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

  async initializeLendingPool(uniswapV2PairAddress: Address) : Promise<LendingPool> {
    const lPool = await this.router.methods.getLendingPool(uniswapV2PairAddress).call();
    const uniswapV2Pair = this.newUniswapV2Pair(uniswapV2PairAddress);
    const tokenAAddress = await uniswapV2Pair.methods.token0().call();
    const tokenBAddress = await uniswapV2Pair.methods.token1().call();
    return {
      uniswapV2Pair: uniswapV2Pair,
      tokenA: this.newERC20(tokenAAddress),
      tokenB: this.newERC20(tokenBAddress),
      collateral: this.newCollateral(lPool.collateral),
      borrowableA: this.newBorrowable(lPool.borrowableA),
      borrowableB: this.newBorrowable(lPool.borrowableB),
    };
  }

  async getLendingPool(uniswapV2PairAddress: Address) : Promise<LendingPool> {
    if (!(uniswapV2PairAddress in this.lendingPool))
      this.lendingPool[uniswapV2PairAddress] = this.initializeLendingPool(uniswapV2PairAddress);
    return this.lendingPool[uniswapV2PairAddress];
  }

  getDeadline() { //1 hour deadline
    return BigNumber.from(Math.floor(Date.now() / 1000) + 3600);
  }

  toAPY(n: number) : number {
    const SECONDS_IN_YEAR = 365 * 24 * 3600;
    return n * SECONDS_IN_YEAR / 1e18;
  }

  async getBorrowableData(uniswapV2PairAddress: Address, poolToken: PoolToken) : Promise<BorrowableData> {
    const lendingPool = await this.getLendingPool(uniswapV2PairAddress);
    const pairConversionPrices = await getPairConversionPrices(uniswapV2PairAddress, this.convertToMainnet);
    let borrowable, token, tokenPrice;
    if (poolToken === PoolToken.BorrowableA) {
      borrowable = lendingPool.borrowableA;
      token = lendingPool.tokenA;
      tokenPrice = pairConversionPrices.tokenAPrice;
    }
    else if (poolToken === PoolToken.BorrowableB) {
      borrowable = lendingPool.borrowableB;
      token = lendingPool.tokenB;
      tokenPrice = pairConversionPrices.tokenBPrice;
    }
    else return null;
    const borrowRate = await borrowable.methods.borrowRate().call();
    const totalBorrows = await borrowable.methods.totalBorrows().call();
    const totalBalance = await borrowable.methods.totalBalance().call();
    const supply = totalBalance + totalBorrows;
    const utilizationRate = supply == 0 ? 0 : totalBalance / supply;
    const supplyRate = borrowRate * utilizationRate;
    return {
      tokenAddress: token._address,
      symbol: await token.methods.symbol().call(),
      name: await token.methods.name().call(),
      supplyUSD: supply / 1e18 * tokenPrice,
      borrowedUSD: totalBorrows / 1e18 * tokenPrice,
      utilizationRate: utilizationRate,
      supplyAPY: this.toAPY(supplyRate),
      borrowAPY: this.toAPY(borrowRate)
    };
  }

  async getAccountData(uniswapV2PairAddress: Address) : Promise<AccountData> {
    if (!this.account) return null;
    const lendingPool = await this.getLendingPool(uniswapV2PairAddress);
    const pairConversionPrices = await getPairConversionPrices(uniswapV2PairAddress, this.convertToMainnet);
    const symbolA = await lendingPool.tokenA.methods.symbol().call();
    const symbolB = await lendingPool.tokenB.methods.symbol().call();
    const borrowedA = await lendingPool.borrowableA.methods.borrowBalance(this.account).call() / 1e18;
    const borrowedB = await lendingPool.borrowableB.methods.borrowBalance(this.account).call() / 1e18;
    const borrowedAUSD = borrowedA * pairConversionPrices.tokenAPrice;
    const borrowedBUSD = borrowedB * pairConversionPrices.tokenBPrice;
    const exchangeRateA = await lendingPool.borrowableA.methods.exchangeRate().call() / 1e18;
    const exchangeRateB = await lendingPool.borrowableB.methods.exchangeRate().call() / 1e18;
    const exchangeRateCollateral = await lendingPool.collateral.methods.exchangeRate().call() / 1e18;
    const balanceA = await lendingPool.borrowableA.methods.balanceOf(this.account).call();
    const balanceB = await lendingPool.borrowableB.methods.balanceOf(this.account).call();
    const balanceCollateral = await lendingPool.collateral.methods.balanceOf(this.account).call();
    const decimalsA = await lendingPool.tokenA.methods.decimals().call();
    const decimalsB = await lendingPool.tokenB.methods.decimals().call();
    const depositedA = balanceA * exchangeRateA / Math.pow(10, decimalsA);
    const depositedB = balanceB * exchangeRateB / Math.pow(10, decimalsB);
    const depositedCollateral = balanceCollateral * exchangeRateCollateral / 1e18;
    const depositedAUSD = depositedA * pairConversionPrices.tokenAPrice;
    const depositedBUSD = depositedB * pairConversionPrices.tokenBPrice;
    const depositedCollateralUSD = depositedCollateral * pairConversionPrices.LPPrice;
    const balanceUSD = depositedAUSD + depositedBUSD + depositedCollateralUSD;
    const debtUSD = borrowedAUSD + borrowedBUSD;
    const equityUSD = balanceUSD - debtUSD;

    const accountBorrowableAData = {
      tokenAddress: lendingPool.tokenA._address,
      borrowableAddress: lendingPool.borrowableA._address,
      symbol: symbolA,
      decimals: decimalsA,
      borrowed: borrowedA,
      borrowedUSD: borrowedAUSD,
      deposited: depositedA,
      depositedUSD: depositedAUSD
    };
    const accountBorrowableBData = {
      tokenAddress: lendingPool.tokenB._address,
      borrowableAddress: lendingPool.borrowableB._address,
      symbol: symbolB,
      decimals: decimalsB,
      borrowed: borrowedB,
      borrowedUSD: borrowedBUSD,
      deposited: depositedB,
      depositedUSD: depositedBUSD
    };
    const accountCollateralData = {
      tokenAAddress: lendingPool.tokenA._address,
      tokenBAddress: lendingPool.tokenB._address,
      collateralAddress: lendingPool.collateral._address,
      symbolA: symbolA,
      symbolB: symbolB,
      decimals: 18,
      deposited: symbolB,
      depositedUSD: depositedAUSD
    };
    return {
      equityUSD: equityUSD,
      balanceUSD: balanceUSD,
      debtUSD: debtUSD,
      riskMetrics: {},
      accountBorrowableAData: accountBorrowableAData,
      accountBorrowableBData: accountBorrowableBData,
      accountCollateralData: accountCollateralData,
    }
  }

  async deposit(tokenAddress: Address, borrowableAddress: Address, val: string|number, decimals: number) {
    const amount = decimalToBalance(val, decimals);
    const deadline = this.getDeadline();
    try {
      if (tokenAddress == this.WETH) {
        const result = await this.router.methods.mintETH(borrowableAddress, this.account, deadline).call({from: this.account, value: amount});
        await this.router.methods.mintETH(borrowableAddress, this.account, deadline).send({from: this.account, value: amount});
      } else {
        const result = await this.router.methods.mint(borrowableAddress, amount, this.account, deadline).call({from: this.account});
        await this.router.methods.mint(borrowableAddress, amount, this.account, deadline).send({from: this.account});
      }
    } catch (e) {
      console.log(e);
    }
  }
}