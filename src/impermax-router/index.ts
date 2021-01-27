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


export default class ImpermaxRouter {
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
          borrowableBaseInfo?: Promise<BorrowableBaseInfo>,
          poolTokenBalance?: Promise<PoolTokenBalance>,
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

  getDeadline() { //1 hour deadline
    return BigNumber.from(Math.floor(Date.now() / 1000) + 3600);
  }

  toAPY(n: number) : number {
    const SECONDS_IN_YEAR = 365 * 24 * 3600;
    return n * SECONDS_IN_YEAR;
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

  async getContracts(uniswapV2PairAddress: Address, poolTokenType: PoolTokenType | PoolTokenType) : Promise<[Contract, Contract]> {
    const lendingPool = await this.getLendingPool(uniswapV2PairAddress);
    if (poolTokenType === PoolTokenType.BorrowableA)
      return [lendingPool.borrowableA, lendingPool.tokenA];
    if (poolTokenType === PoolTokenType.BorrowableB) 
      return [lendingPool.borrowableB, lendingPool.tokenB];
    return [lendingPool.collateral, lendingPool.uniswapV2Pair];
  }

  async initalizeBorrowableBaseInfo(uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<BorrowableBaseInfo> {
    console.log("Called get borrowable base info for:", uniswapV2PairAddress, poolTokenType);
    const [borrowable, token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
    const decimals = await token.methods.decimals().call() * 1;
    const normalize = (n: number) => n / Math.pow(10, decimals);
    return {
      tokenAddress: token._address,
      borrowableAddress: borrowable._address,
      name: await token.methods.name().call(),
      symbol: await token.methods.symbol().call(),
      decimals: decimals,
      totalBalance: normalize(await borrowable.methods.totalBalance().call()),
      totalBorrows: normalize(await borrowable.methods.totalBorrows().call()),
      borrowRate: await borrowable.methods.borrowRate().call() / 1e18,
    };
  }

  async initializePoolTokenBalance(uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<PoolTokenBalance> {
    console.log("Called pool token balance for:", uniswapV2PairAddress, poolTokenType);
    let decimals: number;
    if (poolTokenType === PoolTokenType.Collateral) decimals = 18;
    else {
      const info = await this.getBorrowableBaseInfo(uniswapV2PairAddress, poolTokenType);
      decimals = info.decimals;
    }
    const [poolToken,] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
    const normalize = (n: number) => n / Math.pow(10, decimals);
    const exchangeRate = await poolToken.methods.exchangeRate().call() / 1e18;
    const balance = normalize(await poolToken.methods.balanceOf(this.account).call());
    const deposited = balance * exchangeRate;
    return {
      deposited: deposited,
      borrowed: poolTokenType === PoolTokenType.Collateral ? null :
        normalize(await poolToken.methods.borrowBalance(this.account).call()),
    };
  }

  getLendingPoolCache(uniswapV2PairAddress: Address) {
    if (!(uniswapV2PairAddress in this.lendingPoolCache))
      this.lendingPoolCache[uniswapV2PairAddress] = {};
    return this.lendingPoolCache[uniswapV2PairAddress];
  }
  getPoolTokenCache(uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) {
    const cache = this.getLendingPoolCache(uniswapV2PairAddress);
    if (!cache.poolToken) cache.poolToken = {};
    if (!(poolTokenType in cache.poolToken)) cache.poolToken[poolTokenType] = {};
    return cache.poolToken[poolTokenType];
  }
  async getLendingPool(uniswapV2PairAddress: Address) : Promise<LendingPool> {
    const cache = this.getLendingPoolCache(uniswapV2PairAddress);
    if (!cache.lendingPool) cache.lendingPool = this.initializeLendingPool(uniswapV2PairAddress);
    return cache.lendingPool;
  }
  async getBorrowableBaseInfo(uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<BorrowableBaseInfo> {
    const cache = this.getPoolTokenCache(uniswapV2PairAddress, poolTokenType);
    if (!cache.borrowableBaseInfo) cache.borrowableBaseInfo = this.initalizeBorrowableBaseInfo(uniswapV2PairAddress, poolTokenType);
    return cache.borrowableBaseInfo;
  }
  async getPoolTokenBalance(uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<PoolTokenBalance> {
    const cache = this.getPoolTokenCache(uniswapV2PairAddress, poolTokenType);
    if (!cache.poolTokenBalance) cache.poolTokenBalance = this.initializePoolTokenBalance(uniswapV2PairAddress, poolTokenType);
    return cache.poolTokenBalance;
  }
  async getPairConversionPrices(uniswapV2PairAddress: Address) : Promise<PairConversionPrices> {
    const cache = this.getLendingPoolCache(uniswapV2PairAddress);
    if (!cache.pairConversionPrices) cache.pairConversionPrices = getPairConversionPrices(uniswapV2PairAddress, this.convertToMainnet);
    return cache.pairConversionPrices;
  }
  async getTokenPrice(uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
    const pairConversionPrices = await this.getPairConversionPrices(uniswapV2PairAddress);
    if (poolTokenType == PoolTokenType.BorrowableA) return pairConversionPrices.tokenAPrice;
    if (poolTokenType == PoolTokenType.BorrowableB) return pairConversionPrices.tokenBPrice;
    return pairConversionPrices.LPPrice;
  }

  async getBorrowableData(uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<BorrowableData> {
    const info = await this.getBorrowableBaseInfo(uniswapV2PairAddress, poolTokenType);
    const tokenPrice = await this.getTokenPrice(uniswapV2PairAddress, poolTokenType);
    const supply = info.totalBalance + info.totalBorrows;
    const utilizationRate = supply == 0 ? 0 : info.totalBalance / supply;
    const supplyRate = info.borrowRate * utilizationRate;
    return {
      tokenAddress: info.tokenAddress,
      symbol: info.symbol,
      name: info.name,
      supplyUSD: supply * tokenPrice,
      borrowedUSD: info.totalBorrows * tokenPrice,
      utilizationRate: utilizationRate,
      supplyAPY: this.toAPY(supplyRate),
      borrowAPY: this.toAPY(info.borrowRate)
    };
  }

  async getAccountBorrowableData(uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<AccountBorrowableData> {
    if (!this.account) return null;
    const info = await this.getBorrowableBaseInfo(uniswapV2PairAddress, poolTokenType);
    const balance = await this.getPoolTokenBalance(uniswapV2PairAddress, poolTokenType);
    const tokenPrice = await this.getTokenPrice(uniswapV2PairAddress, poolTokenType);
    return {
      tokenAddress: info.tokenAddress,
      borrowableAddress: info.borrowableAddress,
      symbol: info.symbol,
      decimals: info.decimals,
      borrowed: balance.borrowed,
      borrowedUSD: balance.borrowed * tokenPrice,
      deposited: balance.deposited,
      depositedUSD: balance.deposited * tokenPrice,
    };
  }

  async getAccountCollateralData(uniswapV2PairAddress: Address) : Promise<AccountCollateralData> {
    if (!this.account) return null;
    const [contract,] = await this.getContracts(uniswapV2PairAddress, PoolTokenType.Collateral);
    const dataA = await this.getBorrowableBaseInfo(uniswapV2PairAddress, PoolTokenType.BorrowableA);
    const dataB = await this.getBorrowableBaseInfo(uniswapV2PairAddress, PoolTokenType.BorrowableB);
    const balance = await this.getPoolTokenBalance(uniswapV2PairAddress, PoolTokenType.Collateral);
    const tokenPrice = await this.getTokenPrice(uniswapV2PairAddress, PoolTokenType.Collateral);
    return {
      tokenAAddress: dataA.tokenAddress,
      tokenBAddress: dataB.tokenAddress,
      collateralAddress: contract._address,
      symbolA: dataA.symbol,
      symbolB: dataB.symbol,
      decimals: 18,
      deposited: balance.deposited,
      depositedUSD: balance.deposited * tokenPrice
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

  async deposit(uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, val: string|number) {
    const [poolToken, token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
    const decimals = (poolTokenType == PoolTokenType.Collateral) ? 18 :
      (await this.getBorrowableBaseInfo(uniswapV2PairAddress, poolTokenType)).decimals;
    const amount = decimalToBalance(val, decimals);
    const deadline = this.getDeadline();
    try {
      if (token._address == this.WETH) {
        const result = await this.router.methods.mintETH(poolToken._address, this.account, deadline).call({from: this.account, value: amount});
        await this.router.methods.mintETH(poolToken._address, this.account, deadline).send({from: this.account, value: amount});
      } else {
        const result = await this.router.methods.mint(poolToken._address, amount, this.account, deadline).call({from: this.account});
        await this.router.methods.mint(poolToken._address, amount, this.account, deadline).send({from: this.account, value: 0});
      }
    } catch (e) {
      console.log(e);
    }
  }
}