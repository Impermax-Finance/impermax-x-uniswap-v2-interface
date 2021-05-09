/* eslint-disable no-invalid-this */
import ImpermaxRouter from '.';
import { Address, PoolTokenType, AirdropData } from './interfaces';
import { BigNumber } from 'ethers';
import { PermitData } from '../hooks/useApprove';
import { impermanentLoss } from '../utils';
import { DistributorDetails } from '../utils/constants';
import { CreatePairStep } from '../hooks/useCreateNewPair';

// eslint-disable-next-line @typescript-eslint/ban-types
export async function deposit(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, amount: BigNumber, permitData: PermitData, onTransactionHash: Function) {
  const [poolToken, token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const data = permitData ? permitData.permitData : '0x';
  const deadline = permitData ? permitData.deadline : this.getDeadline();
  let send;
  try {
    // eslint-disable-next-line eqeqeq
    if (token._address == this.WETH) {
      await this.router.methods.mintETH(poolToken._address, this.account, deadline).call({ from: this.account, value: amount });
      send = this.router.methods.mintETH(poolToken._address, this.account, deadline).send({ from: this.account, value: amount });
    // eslint-disable-next-line eqeqeq
    } else if (poolTokenType == PoolTokenType.Collateral) {
      await this.router.methods.mintCollateral(poolToken._address, amount, this.account, deadline, data).call({ from: this.account });
      send = this.router.methods.mintCollateral(poolToken._address, amount, this.account, deadline, data).send({ from: this.account });
    } else {
      await this.router.methods.mint(poolToken._address, amount, this.account, deadline).call({ from: this.account });
      send = this.router.methods.mint(poolToken._address, amount, this.account, deadline).send({ from: this.account });
    }
    return send.on('transactionHash', onTransactionHash);
  } catch (e) {
    console.error(e);
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export async function withdraw(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, tokens: BigNumber, permitData: PermitData, onTransactionHash: Function) {
  const [poolToken, token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const data = permitData ? permitData.permitData : '0x';
  const deadline = permitData ? permitData.deadline : this.getDeadline();
  let send;
  try {
    // eslint-disable-next-line eqeqeq
    if (token._address == this.WETH) {
      await this.router.methods.redeemETH(poolToken._address, tokens, this.account, deadline, data).call({ from: this.account });
      send = this.router.methods.redeemETH(poolToken._address, tokens, this.account, deadline, data).send({ from: this.account });
    } else {
      await this.router.methods.redeem(poolToken._address, tokens, this.account, deadline, data).call({ from: this.account });
      send = this.router.methods.redeem(poolToken._address, tokens, this.account, deadline, data).send({ from: this.account });
    }
    return send.on('transactionHash', onTransactionHash);
  } catch (e) {
    console.error(e);
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export async function borrow(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, amount: BigNumber, permitData: PermitData, onTransactionHash: Function) {
  const [borrowable, token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const data = permitData ? permitData.permitData : '0x';
  const deadline = permitData ? permitData.deadline : this.getDeadline();
  let send;
  try {
    // eslint-disable-next-line eqeqeq
    if (token._address == this.WETH) {
      await this.router.methods.borrowETH(borrowable._address, amount, this.account, deadline, data).call({ from: this.account });
      send = this.router.methods.borrowETH(borrowable._address, amount, this.account, deadline, data).send({ from: this.account });
    } else {
      await this.router.methods.borrow(borrowable._address, amount, this.account, deadline, data).call({ from: this.account });
      send = this.router.methods.borrow(borrowable._address, amount, this.account, deadline, data).send({ from: this.account });
    }
    return send.on('transactionHash', onTransactionHash);
  } catch (e) {
    console.error(e);
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export async function repay(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, amount: BigNumber, onTransactionHash: Function) {
  const [borrowable, token] = await this.getContracts(uniswapV2PairAddress, poolTokenType);
  const deadline = this.getDeadline();
  let send;
  try {
    // eslint-disable-next-line eqeqeq
    if (token._address == this.WETH) {
      await this.router.methods.repayETH(borrowable._address, this.account, deadline).call({ from: this.account, value: amount });
      send = this.router.methods.repayETH(borrowable._address, this.account, deadline).send({ from: this.account, value: amount });
    } else {
      await this.router.methods.repay(borrowable._address, amount, this.account, deadline).call({ from: this.account });
      send = this.router.methods.repay(borrowable._address, amount, this.account, deadline).send({ from: this.account });
    }
    return send.on('transactionHash', onTransactionHash);
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
  const [priceA, priceB] = await this.getMarketPriceDenomLP(uniswapV2PairAddress);
  // This function must use the market price, but the account leverage is calculated with the TWAP, so we need an adjustFactor
  const [priceATWAP] = await this.getPriceDenomLP(uniswapV2PairAddress);
  const diff = priceA > priceATWAP ? priceA / priceATWAP : priceATWAP / priceA;
  const adjustFactor = Math.pow(impermanentLoss(diff ** 2), leverage);
  const currentLeverage = await this.getLeverage(uniswapV2PairAddress);
  const collateralValue = await this.getDeposited(uniswapV2PairAddress, PoolTokenType.Collateral);
  const changeCollateralValue = (collateralValue * leverage / currentLeverage - collateralValue) * adjustFactor;
  const valueForEach = changeCollateralValue / 2;
  const bAmountA = priceA > 0 ? valueForEach / priceA : 0;
  const bAmountB = priceB > 0 ? valueForEach / priceB : 0;
  const cAmount = changeCollateralValue ? changeCollateralValue : 0;
  return {
    bAmountA: bAmountA,
    bAmountB: bAmountB,
    cAmount: cAmount,
    bAmountAMin: bAmountA / slippage,
    bAmountBMin: bAmountB / slippage,
    cAmountMin: cAmount / Math.sqrt(slippage)
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
  permitDataB: PermitData,
  // eslint-disable-next-line @typescript-eslint/ban-types
  onTransactionHash: Function
) {
  const dataA = permitDataA ? permitDataA.permitData : '0x';
  const dataB = permitDataB ? permitDataB.permitData : '0x';
  if (permitDataA && permitDataB && !permitDataA.deadline.eq(permitDataB.deadline)) return console.error('Permits deadline are not equal');
  const deadline = permitDataA ? permitDataA.deadline : permitDataB ? permitDataB.deadline : this.getDeadline();
  try {
    await this.router.methods.leverage(uniswapV2PairAddress, amountA, amountB, amountAMin, amountBMin, this.account, deadline, dataA, dataB).call({ from: this.account });
    const send = this.router.methods.leverage(uniswapV2PairAddress, amountA, amountB, amountAMin, amountBMin, this.account, deadline, dataA, dataB).send({ from: this.account });
    return send.on('transactionHash', onTransactionHash);
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
  const [priceA, priceB] = await this.getMarketPriceDenomLP(uniswapV2PairAddress);
  const valueForEach = changeCollateralValue / 2;
  const bAmountA = priceA > 0 ? valueForEach / priceA : 0;
  const bAmountB = priceB > 0 ? valueForEach / priceB : 0;
  return {
    bAmountA: bAmountA,
    bAmountB: bAmountB,
    cAmount: changeCollateralValue,
    bAmountAMin: bAmountA / Math.sqrt(slippage),
    bAmountBMin: bAmountB / Math.sqrt(slippage)
  };
}
export async function deleverage(
  this: ImpermaxRouter,
  uniswapV2PairAddress: Address,
  tokens: BigNumber,
  amountAMin: BigNumber,
  amountBMin: BigNumber,
  permitData: PermitData,
  // eslint-disable-next-line @typescript-eslint/ban-types
  onTransactionHash: Function
) {
  const data = permitData ? permitData.permitData : '0x';
  const deadline = permitData ? permitData.deadline : this.getDeadline();
  try {
    await this.router.methods.deleverage(uniswapV2PairAddress, tokens, amountAMin, amountBMin, deadline, data).call({ from: this.account });
    const send = this.router.methods.deleverage(uniswapV2PairAddress, tokens, amountAMin, amountBMin, deadline, data).send({ from: this.account });
    return send.on('transactionHash', onTransactionHash);
  } catch (e) {
    console.error(e);
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export async function claimAirdrop(this: ImpermaxRouter, airdropData: AirdropData, onTransactionHash: Function) {
  try {
    await this.merkleDistributor.methods.claim(airdropData.index, this.account, airdropData.amount, airdropData.proof).call({ from: this.account });
    const send = this.merkleDistributor.methods.claim(airdropData.index, this.account, airdropData.amount, airdropData.proof).send({ from: this.account });
    return send.on('transactionHash', onTransactionHash);
  } catch (e) {
    console.error(e);
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export async function trackBorrows(this: ImpermaxRouter, uniswapV2PairAddress: Address, onTransactionHash: Function) {
  const toTrack = [];
  const borrowableA = await this.getPoolToken(uniswapV2PairAddress, PoolTokenType.BorrowableA);
  const borrowableB = await this.getPoolToken(uniswapV2PairAddress, PoolTokenType.BorrowableB);
  const borrowedA = await this.getBorrowed(uniswapV2PairAddress, PoolTokenType.BorrowableA);
  const borrowedB = await this.getBorrowed(uniswapV2PairAddress, PoolTokenType.BorrowableB);
  const sharesA = await this.getFarmingShares(uniswapV2PairAddress, PoolTokenType.BorrowableA);
  const sharesB = await this.getFarmingShares(uniswapV2PairAddress, PoolTokenType.BorrowableB);
  if (borrowedA > 0 && sharesA === 0) toTrack.push(borrowableA._address);
  if (borrowedB > 0 && sharesB === 0) toTrack.push(borrowableB._address);
  try {
    await this.claimAggregator.methods.trackBorrows(this.account, toTrack).call({ from: this.account });
    const send = this.claimAggregator.methods.trackBorrows(this.account, toTrack).send({ from: this.account });
    return send.on('transactionHash', onTransactionHash);
  } catch (e) {
    console.error(e);
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export async function claims(this: ImpermaxRouter, uniswapV2PairAddress: Address, onTransactionHash: Function) {
  const toClaim = [];
  const farmingPoolA = await this.getFarmingPool(uniswapV2PairAddress, PoolTokenType.BorrowableA);
  const farmingPoolB = await this.getFarmingPool(uniswapV2PairAddress, PoolTokenType.BorrowableB);
  const claimAmountA = await farmingPoolA.methods.claim().call({ from: this.account }) / 1e18;
  const claimAmountB = await farmingPoolB.methods.claim().call({ from: this.account }) / 1e18;
  if (claimAmountA * 1 > 0) toClaim.push(farmingPoolA._address);
  if (claimAmountB * 1 > 0) toClaim.push(farmingPoolB._address);
  try {
    await this.claimAggregator.methods.claims(this.account, toClaim).call({ from: this.account });
    const send = this.claimAggregator.methods.claims(this.account, toClaim).send({ from: this.account });
    return send.on('transactionHash', onTransactionHash);
  } catch (e) {
    console.error(e);
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export async function claimDistributor(this: ImpermaxRouter, distributorDetails: DistributorDetails, onTransactionHash: Function) {
  const claimable = await this.getClaimable(distributorDetails.claimableAddress);
  try {
    await claimable.methods.claim().call({ from: this.account });
    const send = claimable.methods.claim().send({ from: this.account });
    return send.on('transactionHash', onTransactionHash);
  } catch (e) {
    console.error(e);
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export async function createNewPair(this: ImpermaxRouter, uniswapV2PairAddress: Address, createPairStep: CreatePairStep, onTransactionHash: Function) {
  try {
    let send;
    if (createPairStep === CreatePairStep.BORROWABLE0) {
      await this.factory.methods.createBorrowable0(uniswapV2PairAddress).call({ from: this.account });
      send = this.factory.methods.createBorrowable0(uniswapV2PairAddress).send({ from: this.account });
    }
    if (createPairStep === CreatePairStep.BORROWABLE1) {
      await this.factory.methods.createBorrowable1(uniswapV2PairAddress).call({ from: this.account });
      send = this.factory.methods.createBorrowable1(uniswapV2PairAddress).send({ from: this.account });
    }
    if (createPairStep === CreatePairStep.COLLATERAL) {
      await this.factory.methods.createCollateral(uniswapV2PairAddress).call({ from: this.account });
      send = this.factory.methods.createCollateral(uniswapV2PairAddress).send({ from: this.account });
    }
    if (createPairStep === CreatePairStep.INITIALIZE) {
      await this.factory.methods.initializeLendingPool(uniswapV2PairAddress).call({ from: this.account });
      send = this.factory.methods.initializeLendingPool(uniswapV2PairAddress).send({ from: this.account });
    }
    return send.on('transactionHash', onTransactionHash);
  } catch (e) {
    console.error(e);
  }
}
