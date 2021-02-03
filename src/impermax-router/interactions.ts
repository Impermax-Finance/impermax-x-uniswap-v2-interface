import ImpermaxRouter from ".";
import { Address, PoolTokenType } from "./interfaces";
import { decimalToBalance } from "../utils/ether-utils";
import { TokenKind } from "graphql";
import { BigNumber } from "ethers";
import BN from "bn.js";

export async function deposit(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, val: string) {
  const [poolToken, token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const tokenAddress = token._address;
  const poolTokenAddress = poolToken._address;
  const decimals = await this.getDecimals(uniswapV2PairAddress, poolTokenType);
  const amount = decimalToBalance(val, decimals);
  const deadline = this.getDeadline();
  try {
    if (tokenAddress == this.WETH) {
      await this.router.methods.mintETH(poolTokenAddress, this.account, deadline).call({from: this.account, value: amount});
      await this.router.methods.mintETH(poolTokenAddress, this.account, deadline).send({from: this.account, value: amount});
    }
    else {
      await token.methods.approve(this.router._address, amount).call({from: this.account});
      await token.methods.approve(this.router._address, amount).send({from: this.account});
      await this.router.methods.mint(poolTokenAddress, amount, this.account, deadline).call({from: this.account});
      await this.router.methods.mint(poolTokenAddress, amount, this.account, deadline).send({from: this.account});
    }
  } catch (e) {
    console.log(e);
  }
}

export async function withdraw(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, val: string) {
  const [poolToken, token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const tokenAddress = token._address;
  const poolTokenAddress = poolToken._address;
  const decimals = await this.getDecimals(uniswapV2PairAddress, poolTokenType);
  const exchangeRate = await this.getExchangeRate(uniswapV2PairAddress, poolTokenType);
  const tokens = decimalToBalance(parseFloat(val) / exchangeRate, decimals);
  const deadline = this.getDeadline();
  try {
    if (tokenAddress == this.WETH) {
      await poolToken.methods.approve(this.router._address, tokens).call({from: this.account});
      await poolToken.methods.approve(this.router._address, tokens).send({from: this.account});
      await this.router.methods.redeemETH(poolTokenAddress, tokens, this.account, deadline, '0x').call({from: this.account});
      await this.router.methods.redeemETH(poolTokenAddress, tokens, this.account, deadline, '0x').send({from: this.account});
    }
    else {
      await poolToken.methods.approve(this.router._address, tokens).call({from: this.account});
      await poolToken.methods.approve(this.router._address, tokens).send({from: this.account});
      await this.router.methods.redeem(poolTokenAddress, tokens, this.account, deadline, '0x').call({from: this.account});
      await this.router.methods.redeem(poolTokenAddress, tokens, this.account, deadline, '0x').send({from: this.account});
    }
  } catch (e) {
    console.log(e);
  }
}

export async function borrow(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, val: string) {
  const [borrowable, token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const tokenAddress = token._address;
  const borrowableAddress = borrowable._address;
  const decimals = await this.getDecimals(uniswapV2PairAddress, poolTokenType);
  const amount = decimalToBalance(val, decimals);
  const deadline = this.getDeadline();
  try {
    if (tokenAddress == this.WETH) {
      await borrowable.methods.borrowApprove(this.router._address, amount).call({from: this.account});
      await borrowable.methods.borrowApprove(this.router._address, amount).send({from: this.account});
      await this.router.methods.borrowETH(borrowableAddress, amount, this.account, deadline, '0x').call({from: this.account});
      await this.router.methods.borrowETH(borrowableAddress, amount, this.account, deadline, '0x').send({from: this.account});
    } else {
      await borrowable.methods.borrowApprove(this.router._address, amount).call({from: this.account});
      await borrowable.methods.borrowApprove(this.router._address, amount).send({from: this.account});
      await this.router.methods.borrow(borrowableAddress, amount, this.account, deadline, '0x').call({from: this.account});
      await this.router.methods.borrow(borrowableAddress, amount, this.account, deadline, '0x').send({from: this.account});
    }
  } catch (e) {
    console.log(e);
  }
}

export async function repay(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, val: string) {
  const [borrowable, token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const tokenAddress = token._address;
  const borrowableAddress = borrowable._address;
  const decimals = await this.getDecimals(uniswapV2PairAddress, poolTokenType);
  const amount = decimalToBalance(val, decimals);
  const deadline = this.getDeadline();
  try {
    if (tokenAddress == this.WETH) {
      await this.router.methods.repayETH(borrowableAddress, this.account, deadline).call({from: this.account, value: amount});
      await this.router.methods.repayETH(borrowableAddress, this.account, deadline).send({from: this.account, value: amount});
    } else {
      await token.methods.approve(this.router._address, amount).call({from: this.account});
      await token.methods.approve(this.router._address, amount).send({from: this.account});
      await this.router.methods.repay(borrowableAddress, amount, this.account, deadline).call({from: this.account});
      await this.router.methods.repay(borrowableAddress, amount, this.account, deadline).send({from: this.account});
    }
  } catch (e) {
    console.log(e);
  }
}

export async function getLeverageAmounts(this: ImpermaxRouter, uniswapV2PairAddress: Address, val: string) : Promise<[number, number, number]> {
  const [priceA, priceB] = await this.getPriceDenomLP(uniswapV2PairAddress);
  const currentLeverage = await this.getLeverage(uniswapV2PairAddress);
  const collateralValue = await this.getDeposited(uniswapV2PairAddress, PoolTokenType.Collateral);
  if (!val) val = currentLeverage.toString();
  const changeCollateralValue = collateralValue * parseFloat(val) / currentLeverage - collateralValue;
  const valueForEach = changeCollateralValue / 2;
  return [valueForEach / priceA, valueForEach / priceB, changeCollateralValue];
}
export async function leverage(this: ImpermaxRouter, uniswapV2PairAddress: Address, val: string) {
  const [borrowableA, tokenA] = await this.getContracts(uniswapV2PairAddress, PoolTokenType.BorrowableA);
  const [borrowableB, tokenB] = await this.getContracts(uniswapV2PairAddress, PoolTokenType.BorrowableB);
  const amountsNumber = await this.getLeverageAmounts(uniswapV2PairAddress, val);
  const decimalsA = await this.getDecimals(uniswapV2PairAddress, PoolTokenType.BorrowableA);
  const decimalsB = await this.getDecimals(uniswapV2PairAddress, PoolTokenType.BorrowableB);
  const amountA = decimalToBalance(amountsNumber[0], decimalsA);
  const amountB = decimalToBalance(amountsNumber[1], decimalsB);
  const deadline = this.getDeadline();
  try {
    await borrowableA.methods.borrowApprove(this.router._address, amountA).call({from: this.account});
    await borrowableB.methods.borrowApprove(this.router._address, amountB).call({from: this.account});
    await borrowableA.methods.borrowApprove(this.router._address, amountA).send({from: this.account});
    await borrowableB.methods.borrowApprove(this.router._address, amountB).send({from: this.account});
    await this.router.methods.leverage(uniswapV2PairAddress, amountA, amountB, '0', '0', this.account, deadline, '0x', '0x').call({from: this.account});
    await this.router.methods.leverage(uniswapV2PairAddress, amountA, amountB, '0', '0', this.account, deadline, '0x', '0x').send({from: this.account});
  } catch (e) {
    console.log(e);
  }
}