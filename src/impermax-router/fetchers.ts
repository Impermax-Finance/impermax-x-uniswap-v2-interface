import ImpermaxRouter from ".";
import { Address, PoolTokenType } from "./interfaces";
import { decimalToBalance } from "../utils/ether-utils";

export function getPoolTokenCache(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) {
  const cache = this.getLendingPoolCache(uniswapV2PairAddress);
  if (!cache.poolToken) cache.poolToken = {};
  if (!(poolTokenType in cache.poolToken)) cache.poolToken[poolTokenType] = {};
  return cache.poolToken[poolTokenType];
}

// Name
export async function initializeName(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<string> {
  if (poolTokenType == PoolTokenType.Collateral) {
    const nameA = await this.getName(uniswapV2PairAddress, PoolTokenType.BorrowableA);
    const nameB = await this.getName(uniswapV2PairAddress, PoolTokenType.BorrowableB);
    return nameA + '-' + nameB + ' LP';
  }
  const [,token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  if (token._address == this.WETH) return 'Ethereum';
  return token.methods.name().call();
}
export async function getName(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<string> {
  const cache = this.getPoolTokenCache(uniswapV2PairAddress, poolTokenType);
  if (!cache.name) cache.name = this.initializeName(uniswapV2PairAddress, poolTokenType);
  return cache.name;
}

// Symbol
export async function initializeSymbol(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<string> {
  if (poolTokenType == PoolTokenType.Collateral) {
    const symbolA = await this.getSymbol(uniswapV2PairAddress, PoolTokenType.BorrowableA);
    const symbolB = await this.getSymbol(uniswapV2PairAddress, PoolTokenType.BorrowableB);
    return symbolA + '-' + symbolB;
  }
  const [,token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  if (token._address == this.WETH) return 'ETH';
  return token.methods.symbol().call();
}
export async function getSymbol(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<string> {
  const cache = this.getPoolTokenCache(uniswapV2PairAddress, poolTokenType);
  if (!cache.symbol) cache.symbol = this.initializeSymbol(uniswapV2PairAddress, poolTokenType);
  return cache.symbol;
}

// Decimals
export async function initializeDecimals(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  if (poolTokenType == PoolTokenType.Collateral) return 18;
  const [,token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const exchangeRate = await token.methods.decimals().call();
  return exchangeRate / 1;
}
export async function getDecimals(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const cache = this.getPoolTokenCache(uniswapV2PairAddress, poolTokenType);
  if (!cache.decimals) cache.decimals = this.initializeDecimals(uniswapV2PairAddress, poolTokenType);
  return cache.decimals;
}

// Exchange rate
export async function initializeExchangeRate(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const [poolToken,] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const exchangeRate = await poolToken.methods.exchangeRate().call();
  return exchangeRate / 1e18;
}
export async function getExchangeRate(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const cache = this.getPoolTokenCache(uniswapV2PairAddress, poolTokenType);
  if (!cache.exchangeRate) cache.exchangeRate = this.initializeExchangeRate(uniswapV2PairAddress, poolTokenType);
  return cache.exchangeRate;
}

// Total balance
export async function initializeTotalBalance(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const [poolToken,] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const amount = await poolToken.methods.totalBalance().call();
  return this.normalize(uniswapV2PairAddress, poolTokenType, amount);
}
export async function getTotalBalance(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const cache = this.getPoolTokenCache(uniswapV2PairAddress, poolTokenType);
  if (!cache.totalBalance) cache.totalBalance = this.initializeTotalBalance(uniswapV2PairAddress, poolTokenType);
  return cache.totalBalance;
}
export async function getTotalBalanceUSD(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const totalBalance = await this.getTotalBalance(uniswapV2PairAddress, poolTokenType);
  const tokenPrice = await this.getTokenPrice(uniswapV2PairAddress, poolTokenType);
  return totalBalance * tokenPrice;
}

// Safety Margin
export async function initializeSafetyMargin(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<number> {
  const [collateral,] = await this.getContracts(uniswapV2PairAddress, PoolTokenType.Collateral);
  const safetyMarginSqrt = await collateral.methods.safetyMarginSqrt().call();
  return (safetyMarginSqrt / 1e18) ** 2;
}
export async function getSafetyMargin(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<number> {
  const cache = this.getLendingPoolCache(uniswapV2PairAddress);
  if (!cache.safetyMargin) cache.safetyMargin = this.initializeSafetyMargin(uniswapV2PairAddress);
  return cache.safetyMargin;
}

// Liquidation Incentive
export async function initializeLiquidationIncentive(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<number> {
  const [collateral,] = await this.getContracts(uniswapV2PairAddress, PoolTokenType.Collateral);
  const liquidationIncentive = await collateral.methods.liquidationIncentive().call();
  return liquidationIncentive / 1e18;
}
export async function getLiquidationIncentive(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<number> {
  const cache = this.getLendingPoolCache(uniswapV2PairAddress);
  if (!cache.liquidationIncentive) cache.liquidationIncentive = this.initializeLiquidationIncentive(uniswapV2PairAddress);
  return cache.liquidationIncentive;
}

// Reserves
export async function initializeReserves(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<[number, number]> {
  const [,uniswapV2Pair] = await this.getContracts(uniswapV2PairAddress, PoolTokenType.Collateral);
  const { reserve0, reserve1 } = await uniswapV2Pair.methods.getReserves().call();
  return [
    await this.normalize(uniswapV2PairAddress, PoolTokenType.BorrowableA, reserve0),
    await this.normalize(uniswapV2PairAddress, PoolTokenType.BorrowableB, reserve1)
  ];
}
export async function getReserves(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<[number, number]> {
  const cache = this.getLendingPoolCache(uniswapV2PairAddress);
  if (!cache.reserves) cache.reserves = this.initializeReserves(uniswapV2PairAddress);
  return cache.reserves;
}

// LP Total Supply
export async function initializeLPTotalSupply(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<number> {
  const [,uniswapV2Pair] = await this.getContracts(uniswapV2PairAddress, PoolTokenType.Collateral);
  const totalSupply = await uniswapV2Pair.methods.totalSupply().call();
  return this.normalize(uniswapV2PairAddress, PoolTokenType.Collateral, totalSupply);
}
export async function getLPTotalSupply(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<number> {
  const cache = this.getLendingPoolCache(uniswapV2PairAddress);
  if (!cache.LPTotalSupply) cache.LPTotalSupply = this.initializeLPTotalSupply(uniswapV2PairAddress);
  return cache.LPTotalSupply;
}

// Price Denom LP
export async function initializePriceDenomLP(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<[number, number]> {
  const [collateral,] = await this.getContracts(uniswapV2PairAddress, PoolTokenType.Collateral);
  const { price0, price1 } = await collateral.methods.getPrices().call();
  return [
    await this.normalize(uniswapV2PairAddress, PoolTokenType.BorrowableA, price0),
    await this.normalize(uniswapV2PairAddress, PoolTokenType.BorrowableB, price1)
  ];
}
export async function getPriceDenomLP(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<[number, number]> {
  const cache = this.getLendingPoolCache(uniswapV2PairAddress);
  if (!cache.priceDenomLP) cache.priceDenomLP = this.initializePriceDenomLP(uniswapV2PairAddress);
  return cache.priceDenomLP;
}
export async function getBorrowablePriceDenomLP(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const [priceA, priceB] = await this.getPriceDenomLP(uniswapV2PairAddress);
  if (poolTokenType == PoolTokenType.BorrowableA) return priceA;
  return priceB;
}
export async function getMarketPriceDenomLP(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<[number, number]> {
  const [reserve0, reserve1] = await this.getReserves(uniswapV2PairAddress);
  const totalSupply = await this.getLPTotalSupply(uniswapV2PairAddress);
  return [
    reserve0 / totalSupply,
    reserve1 / totalSupply,
  ];
}

// Market Price
export async function getMarketPrice(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<number> {
  const [reserve0, reserve1] = await this.getReserves(uniswapV2PairAddress);
  return this.priceInverted ? 1 * reserve0 / reserve1 : 1 * reserve1 / reserve0;
}

// TWAP Price
export async function initializeTWAPPrice(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<number> {
  const { price } = await this.simpleUniswapOracle.methods.getResult(uniswapV2PairAddress).call();
  return price / 2**112;
}
export async function getTWAPPrice(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<number> {
  const cache = this.getLendingPoolCache(uniswapV2PairAddress);
  if (!cache.TWAPPrice) cache.TWAPPrice = this.initializeTWAPPrice(uniswapV2PairAddress);
  return !this.priceInverted ? (await cache.TWAPPrice) :  1 / (await cache.TWAPPrice);
}