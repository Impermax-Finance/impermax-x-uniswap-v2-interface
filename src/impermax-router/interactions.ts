import ImpermaxRouter from ".";
import { Address, PoolTokenType } from "./interfaces";
import { decimalToBalance } from "../utils/ether-utils";
import { TokenKind } from "graphql";
import { BigNumber, ethers } from "ethers";
import BN from "bn.js";
import { PermitData } from "../hooks/useApprove";

export async function deposit(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, amount: BigNumber, permitData: PermitData) {
  const [poolToken, token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const data = permitData ? permitData.permitData : '0x';
  const deadline = permitData ? permitData.deadline : this.getDeadline();
  try {
    if (token._address == this.WETH) {
      await this.router.methods.mintETH(poolToken._address, this.account, deadline).call({from: this.account, value: amount});
      return this.router.methods.mintETH(poolToken._address, this.account, deadline).send({from: this.account, value: amount});
    }
    if (poolTokenType == PoolTokenType.Collateral) {
      await this.router.methods.mintCollateral(poolToken._address, amount, this.account, deadline, data).call({from: this.account});
      return this.router.methods.mintCollateral(poolToken._address, amount, this.account, deadline, data).send({from: this.account});
    }
    else {
      await this.router.methods.mint(poolToken._address, amount, this.account, deadline).call({from: this.account});
      return this.router.methods.mint(poolToken._address, amount, this.account, deadline).send({from: this.account});
    }
  } catch (e) {
    console.error(e);
  }
}

export async function withdraw(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, tokens: BigNumber, permitData: PermitData) {
  const [poolToken, token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const data = permitData ? permitData.permitData : '0x';
  const deadline = permitData ? permitData.deadline : this.getDeadline();
  try {
    if (token._address == this.WETH) {
      await this.router.methods.redeemETH(poolToken._address, tokens, this.account, deadline, data).call({from: this.account});
      return this.router.methods.redeemETH(poolToken._address, tokens, this.account, deadline, data).send({from: this.account});
    }
    else {
      await this.router.methods.redeem(poolToken._address, tokens, this.account, deadline, data).call({from: this.account});
      return this.router.methods.redeem(poolToken._address, tokens, this.account, deadline, data).send({from: this.account});
    }
  } catch (e) {
    console.error(e);
  }
}

export async function borrow(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, amount: BigNumber, permitData: PermitData) {
  const [borrowable, token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const data = permitData ? permitData.permitData : '0x';
  const deadline = permitData ? permitData.deadline : this.getDeadline();
  try {
    if (token._address == this.WETH) {
      await this.router.methods.borrowETH(borrowable._address, amount, this.account, deadline, data).call({from: this.account});
      return this.router.methods.borrowETH(borrowable._address, amount, this.account, deadline, data).send({from: this.account});
    } else {
      await this.router.methods.borrow(borrowable._address, amount, this.account, deadline, data).call({from: this.account});
      return this.router.methods.borrow(borrowable._address, amount, this.account, deadline, data).send({from: this.account});
    }
  } catch (e) {
    console.error(e);
  }
}

export async function repay(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, amount: BigNumber) {
  const [borrowable, token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const deadline = this.getDeadline();
  try {
    if (token._address == this.WETH) {
      await this.router.methods.repayETH(borrowable._address, this.account, deadline).call({from: this.account, value: amount});
      return this.router.methods.repayETH(borrowable._address, this.account, deadline).send({from: this.account, value: amount});
    } else {
      await this.router.methods.repay(borrowable._address, amount, this.account, deadline).call({from: this.account});
      return this.router.methods.repay(borrowable._address, amount, this.account, deadline).send({from: this.account});
    }
  } catch (e) {
    console.error(e);
  }
}

export async function getLeverageAmounts(
  this: ImpermaxRouter, 
  uniswapV2PairAddress: Address, 
  leverage: number,
  slippage: number
) : Promise<{bAmountA: number, bAmountB: number, cAmount: number, bAmountAMin: number, bAmountBMin: number, cAmountMin: number}> {
  const [priceA, priceB] = await this.getPriceDenomLP(uniswapV2PairAddress);
  const currentLeverage = await this.getLeverage(uniswapV2PairAddress);
  const collateralValue = await this.getDeposited(uniswapV2PairAddress, PoolTokenType.Collateral);
  const changeCollateralValue = collateralValue * leverage / currentLeverage - collateralValue;
  const valueForEach = changeCollateralValue / 2;
  return {
    bAmountA: valueForEach / priceA,
    bAmountB: valueForEach / priceB,
    cAmount: changeCollateralValue,
    bAmountAMin: valueForEach / priceA / Math.sqrt(slippage),
    bAmountBMin: valueForEach / priceB / Math.sqrt(slippage),
    cAmountMin: changeCollateralValue / Math.sqrt(Math.sqrt(slippage)),
  };
}
export async function leverage(
  this: ImpermaxRouter, 
  uniswapV2PairAddress: Address, 
  amountA: BigNumber, 
  amountB: BigNumber,
  amountAMin: BigNumber, 
  amountBMin: BigNumber,
  permitDataA: PermitData, 
  permitDataB: PermitData
) {
  const dataA = permitDataA ? permitDataA.permitData : '0x';
  const dataB = permitDataB ? permitDataB.permitData : '0x';
  if (permitDataA && permitDataB && !permitDataA.deadline.eq(permitDataB.deadline)) return console.error("Permits deadline are not equal")
  const deadline = permitDataA ? permitDataA.deadline : permitDataB ? permitDataB.deadline : this.getDeadline();
  try {
    await this.router.methods.leverage(uniswapV2PairAddress, amountA, amountB, amountAMin, amountBMin, this.account, deadline, dataA, dataB).call({from: this.account});
    return this.router.methods.leverage(uniswapV2PairAddress, amountA, amountB, amountAMin, amountBMin, this.account, deadline, dataA, dataB).send({from: this.account});
  } catch (e) {
    console.error(e);
  }
}

export async function getDeleverageAmounts(
  this: ImpermaxRouter, 
  uniswapV2PairAddress: Address, 
  changeCollateralValue: number,
  slippage: number
) : Promise<{bAmountA: number, bAmountB: number, cAmount: number, bAmountAMin: number, bAmountBMin: number}> {
  const [priceA, priceB] = await this.getPriceDenomLP(uniswapV2PairAddress);
  const valueForEach = changeCollateralValue / 2;
  return {
    bAmountA: valueForEach / priceA,
    bAmountB: valueForEach / priceB,
    cAmount: changeCollateralValue,
    bAmountAMin: valueForEach / priceA / Math.sqrt(slippage),
    bAmountBMin: valueForEach / priceB / Math.sqrt(slippage),
  };
}
export async function deleverage(
  this: ImpermaxRouter, 
  uniswapV2PairAddress: Address, 
  tokens: BigNumber, 
  amountAMin: BigNumber, 
  amountBMin: BigNumber,
  permitData: PermitData
) {
  const data = permitData ? permitData.permitData : '0x';
  const deadline = permitData ? permitData.deadline : this.getDeadline();
  try {
    await this.router.methods.deleverage(uniswapV2PairAddress, tokens, amountAMin, amountBMin, deadline, data).call({from: this.account});
    return this.router.methods.deleverage(uniswapV2PairAddress, tokens, amountAMin, amountBMin, deadline, data).send({from: this.account});
  } catch (e) {
    console.error(e);
  }
}