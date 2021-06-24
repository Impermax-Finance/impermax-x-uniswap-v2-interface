/* eslint-disable no-invalid-this */
import { Address, PoolTokenType, BorrowableData } from '../impermax-router/interfaces';
import Subgraph from '.';
import { IMX_ADDRESSES } from 'config/web3/contracts/imx';
import { WETH_ADDRESSES } from 'config/web3/contracts/weth';
import toAPY from 'services/to-apy';
import getPairAddress from 'services/get-pair-address';

// Name
export async function getName(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<string> {
  if (poolTokenType === PoolTokenType.Collateral) {
    const nameA = await this.getName(uniswapV2PairAddress, PoolTokenType.BorrowableA);
    const nameB = await this.getName(uniswapV2PairAddress, PoolTokenType.BorrowableB);
    return nameA + '-' + nameB + ' LP';
  }
  const underlying = await this.getUnderlyingAddress(uniswapV2PairAddress, poolTokenType);
  const wethAddress = WETH_ADDRESSES[this.chainId];
  if (underlying === wethAddress.toLowerCase()) return 'Ethereum';
  const lendingPoolData = await this.getLendingPoolData(uniswapV2PairAddress);
  return lendingPoolData[poolTokenType].underlying.name;
}

// ray test touch <<
// Symbol
export async function getSymbol(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<string> {
  if (poolTokenType === PoolTokenType.Collateral) {
    const symbolA = await this.getSymbol(uniswapV2PairAddress, PoolTokenType.BorrowableA);
    const symbolB = await this.getSymbol(uniswapV2PairAddress, PoolTokenType.BorrowableB);
    return symbolA + '-' + symbolB;
  }
  const underlying = await this.getUnderlyingAddress(uniswapV2PairAddress, poolTokenType);
  const wethAddress = WETH_ADDRESSES[this.chainId];
  if (underlying === wethAddress.toLowerCase()) return 'ETH';
  const lendingPoolData = await this.getLendingPoolData(uniswapV2PairAddress);
  return lendingPoolData[poolTokenType].underlying.symbol;
}
// ray test touch >>

// Decimals
export async function getDecimals(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  if (poolTokenType === PoolTokenType.Collateral) return 18;
  const lendingPoolData = await this.getLendingPoolData(uniswapV2PairAddress);
  return parseInt(lendingPoolData[poolTokenType].underlying.decimals);
}

// ExchangeRate
export async function getExchangeRate(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const lendingPoolData = await this.getLendingPoolData(uniswapV2PairAddress);
  return parseFloat(lendingPoolData[poolTokenType].exchangeRate);
}

// ray test touch <<
// Underlying Address
export async function getUnderlyingAddress(
  this: Subgraph,
  uniswapV2PairAddress: Address,
  poolTokenType: PoolTokenType
) : Promise<Address> {
  if (poolTokenType === PoolTokenType.Collateral) return uniswapV2PairAddress;

  const lendingPoolData = await this.getLendingPoolData(uniswapV2PairAddress);

  return lendingPoolData[poolTokenType].underlying.id;
}
// ray test touch >>

// ray test touch <<
// Token price
export async function getTokenPrice(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const lendingPoolData = await this.getLendingPoolData(uniswapV2PairAddress);
  if (poolTokenType === PoolTokenType.Collateral) {
    return parseFloat(lendingPoolData.pair.derivedUSD);
  }
  return parseFloat((lendingPoolData[poolTokenType] as BorrowableData).underlying.derivedUSD);
}
// ray test touch >>
// ray test touch <<
export async function getImxPrice(this: Subgraph) : Promise<number> {
  const imxAddress = IMX_ADDRESSES[this.chainId];
  const wethAddress = WETH_ADDRESSES[this.chainId];
  const IMXPair = getPairAddress(wethAddress, imxAddress, this.chainId);
  const AAddress = await this.getUnderlyingAddress(IMXPair, PoolTokenType.BorrowableA);
  const poolTokenType = AAddress.toLowerCase() === imxAddress.toLowerCase() ? PoolTokenType.BorrowableA : PoolTokenType.BorrowableB;
  return this.getTokenPrice(IMXPair, poolTokenType);
}
// ray test touch >>

// ray test touch <<
// Total balance
export async function getTotalBalance(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const lendingPoolData = await this.getLendingPoolData(uniswapV2PairAddress);
  return parseFloat(lendingPoolData[poolTokenType].totalBalance);
}
// ray test touch >>
export async function getTotalBalanceUSD(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const lendingPoolData = await this.getLendingPoolData(uniswapV2PairAddress);
  return parseFloat(lendingPoolData[poolTokenType].totalBalanceUSD);
}

// Safety Margin
export async function getSafetyMargin(this: Subgraph, uniswapV2PairAddress: Address) : Promise<number> {
  const lendingPoolData = await this.getLendingPoolData(uniswapV2PairAddress);
  return parseFloat(lendingPoolData[PoolTokenType.Collateral].safetyMargin);
}

// Liquidation Incentive
export async function getLiquidationIncentive(this: Subgraph, uniswapV2PairAddress: Address) : Promise<number> {
  const lendingPoolData = await this.getLendingPoolData(uniswapV2PairAddress);
  return parseFloat(lendingPoolData[PoolTokenType.Collateral].liquidationIncentive);
}

// ray test touch <<
// Reserve Factor
export async function getReserveFactor(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const lendingPoolData = await this.getLendingPoolData(uniswapV2PairAddress);
  return parseFloat((lendingPoolData[poolTokenType] as BorrowableData).reserveFactor);
}
// ray test touch >>

// Kink Borrow Rate
export async function getKinkBorrowRate(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const lendingPoolData = await this.getLendingPoolData(uniswapV2PairAddress);
  return parseFloat((lendingPoolData[poolTokenType] as BorrowableData).kinkBorrowRate);
}

// Kink Utilization Rate
export async function getKinkUtilizationRate(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const lendingPoolData = await this.getLendingPoolData(uniswapV2PairAddress);
  return parseFloat((lendingPoolData[poolTokenType] as BorrowableData).kinkUtilizationRate);
}

// Borrow Index
export async function getBorrowIndex(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const lendingPoolData = await this.getLendingPoolData(uniswapV2PairAddress);
  return parseFloat((lendingPoolData[poolTokenType] as BorrowableData).borrowIndex);
}

// ray test touch <<
// Accrue Timestamp
export async function getAccrualTimestamp(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const lendingPoolData = await this.getLendingPoolData(uniswapV2PairAddress);
  return parseFloat((lendingPoolData[poolTokenType] as BorrowableData).accrualTimestamp);
}
// ray test touch >>

// ray test touch <<
// Total borrows
export async function getTotalBorrows(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const lendingPoolData = await this.getLendingPoolData(uniswapV2PairAddress);
  return parseFloat((lendingPoolData[poolTokenType] as BorrowableData).totalBorrows);
}
// ray test touch >>
// ray test touch <<
export async function getCurrentTotalBorrows(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const storedAmount = await this.getTotalBorrows(uniswapV2PairAddress, poolTokenType);
  const accrualTimestamp = await this.getAccrualTimestamp(uniswapV2PairAddress, poolTokenType);
  const borrowRate = await this.getBorrowRate(uniswapV2PairAddress, poolTokenType);
  return storedAmount * (1 + (Date.now() / 1000 - accrualTimestamp) * borrowRate);
}
// ray test touch >>
// ray test touch <<
export async function getTotalBorrowsUSD(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const totalBorrows = await this.getCurrentTotalBorrows(uniswapV2PairAddress, poolTokenType);
  const tokenPrice = await this.getTokenPrice(uniswapV2PairAddress, poolTokenType);
  return totalBorrows * tokenPrice;
}
// ray test touch >>

// ray test touch <<
// Borrow rate
export async function getBorrowRate(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const lendingPoolData = await this.getLendingPoolData(uniswapV2PairAddress);
  return parseFloat((lendingPoolData[poolTokenType] as BorrowableData).borrowRate);
}
// ray test touch >>
// ray test touch <<
export async function getBorrowAPY(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const borrowRate = await this.getBorrowRate(uniswapV2PairAddress, poolTokenType);
  return toAPY(borrowRate);
}
// ray test touch >>
export async function getNextBorrowRate(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, borrowAmount: number) : Promise<number> {
  const totalBorrows = await this.getTotalBorrows(uniswapV2PairAddress, poolTokenType);
  const supply = await this.getSupply(uniswapV2PairAddress, poolTokenType);
  const utilizationRate = (borrowAmount + totalBorrows) / supply;
  const kinkBorrowRate = await this.getKinkBorrowRate(uniswapV2PairAddress, poolTokenType);
  const kinkUtilizationRate = await this.getKinkUtilizationRate(uniswapV2PairAddress, poolTokenType);
  if (utilizationRate < kinkUtilizationRate) return utilizationRate / kinkUtilizationRate * kinkBorrowRate;
  return ((utilizationRate - kinkUtilizationRate) / (1 - kinkUtilizationRate) * 4 + 1) * kinkBorrowRate;
}
export async function getNextBorrowAPY(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, borrowAmount: number) : Promise<number> {
  const borrowRate = await this.getNextBorrowRate(uniswapV2PairAddress, poolTokenType, borrowAmount);
  return toAPY(borrowRate);
}

// ray test touch <<
// Supply
export async function getSupply(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const totalBalance = await this.getTotalBalance(uniswapV2PairAddress, poolTokenType);
  const totalBorrows = await this.getTotalBorrows(uniswapV2PairAddress, poolTokenType);
  return totalBalance + totalBorrows;
}
export async function getCurrentSupply(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const storedAmount = await this.getSupply(uniswapV2PairAddress, poolTokenType);
  const accrualTimestamp = await this.getAccrualTimestamp(uniswapV2PairAddress, poolTokenType);
  const supplyRate = await this.getSupplyRate(uniswapV2PairAddress, poolTokenType);
  return storedAmount * (1 + (Date.now() / 1000 - accrualTimestamp) * supplyRate);
}
export async function getSupplyUSD(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const supply = await this.getCurrentSupply(uniswapV2PairAddress, poolTokenType);
  const tokenPrice = await this.getTokenPrice(uniswapV2PairAddress, poolTokenType);
  return supply * tokenPrice;
}
// ray test touch >>

// ray test touch <<
// Utilization Rate
export async function getUtilizationRate(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const supply = await this.getSupply(uniswapV2PairAddress, poolTokenType);
  if (supply === 0) return 0;
  const totalBalance = await this.getTotalBorrows(uniswapV2PairAddress, poolTokenType);
  return totalBalance / supply;
}
// ray test touch >>

// ray test touch <<
// Supply Rate
export async function getSupplyRate(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const borrowRate = await this.getBorrowRate(uniswapV2PairAddress, poolTokenType);
  const utilizationRate = await this.getUtilizationRate(uniswapV2PairAddress, poolTokenType);
  const reserveFactor = await this.getReserveFactor(uniswapV2PairAddress, poolTokenType);
  return borrowRate * utilizationRate * (1 - reserveFactor);
}
// ray test touch >>
// ray test touch <<
export async function getSupplyAPY(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const supplyRate = await this.getSupplyRate(uniswapV2PairAddress, poolTokenType);
  return toAPY(supplyRate);
}
// ray test touch >>
export async function getNextSupplyRate(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, supplyAmount: number) : Promise<number> {
  const totalBorrows = await this.getTotalBorrows(uniswapV2PairAddress, poolTokenType);
  const supply = await this.getSupply(uniswapV2PairAddress, poolTokenType);
  const utilizationRate = totalBorrows / (supply + supplyAmount);
  const kinkBorrowRate = await this.getKinkBorrowRate(uniswapV2PairAddress, poolTokenType);
  const kinkUtilizationRate = await this.getKinkUtilizationRate(uniswapV2PairAddress, poolTokenType);
  const reserveFactor = await this.getReserveFactor(uniswapV2PairAddress, poolTokenType);
  if (utilizationRate < kinkUtilizationRate) return utilizationRate / kinkUtilizationRate * kinkBorrowRate * utilizationRate * (1 - reserveFactor);
  return ((utilizationRate - kinkUtilizationRate) / (1 - kinkUtilizationRate) * 4 + 1) * kinkBorrowRate * utilizationRate * (1 - reserveFactor);
}
export async function getNextSupplyAPY(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, supplyAmount: number) : Promise<number> {
  const supplyRate = await this.getNextSupplyRate(uniswapV2PairAddress, poolTokenType, supplyAmount);
  return toAPY(supplyRate);
}

// ray test touch <<
// Utilization Rate
export async function getUniswapAPY(this: Subgraph, uniswapV2PairAddress: Address) : Promise<number> {
  const lendingPoolData = await this.getLendingPoolData(uniswapV2PairAddress);
  return lendingPoolData.pair.uniswapAPY;
}
// ray test touch >>

// TVL Data
export async function getTotalValueLocked(this: Subgraph) : Promise<number> {
  const tvlData = await this.getTvlData();
  return parseInt(tvlData.totalBalanceUSD);
}
export async function getTotalValueSupplied(this: Subgraph) : Promise<number> {
  const tvlData = await this.getTvlData();
  return parseInt(tvlData.totalSupplyUSD);
}
export async function getTotalValueBorrowed(this: Subgraph) : Promise<number> {
  const tvlData = await this.getTvlData();
  return parseInt(tvlData.totalBorrowsUSD);
}

// ray test touch <<
// Reward Speed
export async function getRewardSpeed(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const lendingPoolData = await this.getLendingPoolData(uniswapV2PairAddress);
  const farmingPoolData = (lendingPoolData[poolTokenType] as BorrowableData).farmingPool;
  if (farmingPoolData === null) return 0;
  const segmentLength = parseInt(farmingPoolData.segmentLength);
  const epochBegin = parseInt(farmingPoolData.epochBegin);
  const epochAmount = parseFloat(farmingPoolData.epochAmount);
  const epochEnd = epochBegin + segmentLength;
  const timestamp = (new Date()).getTime() / 1000;
  if (timestamp > epochEnd) {
    // How to manage better this case? Maybe check shares on distributor
    return 0;
  }
  return epochAmount / segmentLength;
}
// ray test touch >>

// ray test touch <<
// Farming
export async function getFarmingAPY(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  return this.getNextFarmingAPY(uniswapV2PairAddress, poolTokenType, 0);
}
// ray test touch >>
// ray test touch <<
export async function getNextFarmingAPY(this: Subgraph, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, borrowAmount: number) : Promise<number> {
  const imxPrice = await this.getImxPrice();
  const rewardSpeed = await this.getRewardSpeed(uniswapV2PairAddress, poolTokenType);
  const currentBorrowedUSD = await this.getTotalBorrowsUSD(uniswapV2PairAddress, poolTokenType);
  const tokenPrice = await this.getTokenPrice(uniswapV2PairAddress, poolTokenType);
  const additionalBorrowsUSD = borrowAmount * tokenPrice;
  const totalBorrowedUSD = currentBorrowedUSD + additionalBorrowsUSD;
  if (totalBorrowedUSD === 0) return 0;
  return toAPY(imxPrice * rewardSpeed / totalBorrowedUSD);
}
// ray test touch >>
