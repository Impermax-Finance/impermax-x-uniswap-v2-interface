
// ray test touch <<
import { W_ETH_ADDRESSES } from 'config/web3/contracts/w-eths';
import {
  PoolTokenType,
  LendingPoolData
} from 'types/interfaces';

const getLendingPoolTokenName = (
  lendingPool: LendingPoolData,
  poolTokenType: PoolTokenType.BorrowableA | PoolTokenType.BorrowableB,
  chainID: number
): string => {
  const wETHAddress = W_ETH_ADDRESSES[chainID];
  const lowerCasedWETHAddress = wETHAddress.toLowerCase();
  const underlyingAddress = lendingPool[poolTokenType].underlying.id;

  if (underlyingAddress === lowerCasedWETHAddress) {
    return 'Ethereum';
  } else {
    return lendingPool[poolTokenType].underlying.name;
  }
};

// TODO: double-check with `useSymbol`
const getLendingPoolTokenSymbol = (
  lendingPool: LendingPoolData,
  poolTokenType: PoolTokenType.BorrowableA | PoolTokenType.BorrowableB,
  chainID: number
): string => {
  const wETHAddress = W_ETH_ADDRESSES[chainID];
  const lowerCasedWETHAddress = wETHAddress.toLowerCase();
  const underlyingAddress = lendingPool[poolTokenType].underlying.id;

  if (underlyingAddress === lowerCasedWETHAddress) {
    return 'ETH';
  } else {
    return lendingPool[poolTokenType].underlying.symbol;
  }
};

const getLendingPoolTokenSupplyInUSD = (
  lendingPool: LendingPoolData,
  poolTokenType: PoolTokenType.BorrowableA | PoolTokenType.BorrowableB
): number => {
  const totalBalance = parseFloat(lendingPool[poolTokenType].totalBalance);
  const totalBorrows = parseFloat(lendingPool[poolTokenType].totalBorrows);
  const supply = totalBalance + totalBorrows;
  const utilizationRate = supply === 0 ? 0 : totalBorrows / supply; // TODO: could be a function

  const borrowRate = parseFloat(lendingPool[poolTokenType].borrowRate);
  const reserveFactor = parseFloat(lendingPool[poolTokenType].reserveFactor);
  const supplyRate = borrowRate * utilizationRate * (1 - reserveFactor); // TODO: could be a function

  const accrualTimestamp = parseFloat(lendingPool[poolTokenType].accrualTimestamp);
  const currentSupply = supply * (1 + (Date.now() / 1000 - accrualTimestamp) * supplyRate);
  const tokenPriceInUSD = parseFloat(lendingPool[poolTokenType].underlying.derivedUSD);
  const supplyInUSD = currentSupply * tokenPriceInUSD;

  return supplyInUSD;
};

export {
  getLendingPoolTokenName,
  getLendingPoolTokenSymbol,
  getLendingPoolTokenSupplyInUSD
};
// ray test touch >>
