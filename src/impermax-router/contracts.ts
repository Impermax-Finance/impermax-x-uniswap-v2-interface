import ImpermaxRouter from "."
import { Address, LendingPool, PoolTokenType, Contract } from "./interfaces";
import { decimalToBalance } from "../utils/ether-utils";

export async function initializeLendingPool(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<LendingPool> {
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

export function getLendingPoolCache(this: ImpermaxRouter, uniswapV2PairAddress: Address) {
  if (!(uniswapV2PairAddress in this.lendingPoolCache))
    this.lendingPoolCache[uniswapV2PairAddress] = {};
  return this.lendingPoolCache[uniswapV2PairAddress];
}

export async function getLendingPool(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<LendingPool> {
  const cache = this.getLendingPoolCache(uniswapV2PairAddress);
  if (!cache.lendingPool) cache.lendingPool = this.initializeLendingPool(uniswapV2PairAddress);
  return cache.lendingPool;
}

export async function getContracts(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<[Contract, Contract]> {
  const lendingPool = await this.getLendingPool(uniswapV2PairAddress);  
  if (poolTokenType === PoolTokenType.BorrowableA)
    return [lendingPool.borrowableA, lendingPool.tokenA];
  if (poolTokenType === PoolTokenType.BorrowableB) 
    return [lendingPool.borrowableB, lendingPool.tokenB];
  return [lendingPool.collateral, lendingPool.uniswapV2Pair];
}

// Address
export async function getPoolTokenAddress(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<string> {
  const [poolToken,] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  return poolToken._address;
}
export async function getTokenAddress(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<string> {
  const [,token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  return token._address;
}