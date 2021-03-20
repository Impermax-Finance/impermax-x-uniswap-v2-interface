import ImpermaxRouter from ".";
import { Address, AirdropData, PoolTokenType, ClaimEvent } from "./interfaces";
import { decimalToBalance } from "../utils/ether-utils";
import { BigNumber } from "ethers";

// IMX Price
export async function getImxPrice(this: ImpermaxRouter) : Promise<number> {
  if (this.chainId == 3) return 0.1;
  return 0.1; // TODO dynamic IMX price
}

// Airdrop Data
export async function initializeAirdropData(this: ImpermaxRouter) : Promise<AirdropData> {
  try {
    const json = await fetch(this.airdropUrl + '/' + this.account);
    const data = await json.json();
    if (data) {
      data.amount = BigNumber.from(data.amount);
      const isClaimed = await this.merkleDistributor.methods.isClaimed(data.index).call();
      if (!isClaimed) return data;
    }
  }
  catch { }
  return {
    index: -1,
    amount: null,
    proof: [],
  }
}
export async function getAirdropData(this: ImpermaxRouter) : Promise<AirdropData> {
  if (!this.imxCache.airdropData) this.imxCache.airdropData = await this.initializeAirdropData();
  return this.imxCache.airdropData;
}

export async function hasClaimableAirdrop(this: ImpermaxRouter) : Promise<boolean> {
  const airdropData = await this.getAirdropData();
  if (airdropData.amount) return true;
  return false;
}

// Reward Speed (IMX per second)
export async function initializeRewardSpeed(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const farmingPool = await this.getFarmingPool(uniswapV2PairAddress, poolTokenType);
  if (!farmingPool) return 0;
  const segmentLength = await farmingPool.methods.segmentLength().call();
  const epochBegin = await farmingPool.methods.epochBegin().call();
  const epochAmount = await farmingPool.methods.epochAmount().call();
  const epochEnd = epochBegin + segmentLength;
  const timestamp = (new Date()).getTime() / 1000;
  if (timestamp > epochEnd) {
    // How to manage better this case? Maybe check shares on distributor
    return 0;
  }
  return epochAmount / 1e18 / segmentLength;
}
export async function getRewardSpeed(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const cache = this.getPoolTokenCache(uniswapV2PairAddress, poolTokenType);
  if (!cache.rewardSpeed) cache.rewardSpeed = this.initializeRewardSpeed(uniswapV2PairAddress, poolTokenType);
  return cache.rewardSpeed;
}

// Farming Shares
export async function initializeFarmingShares(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const farmingPool = await this.getFarmingPool(uniswapV2PairAddress, poolTokenType);
  if (!farmingPool) return 0;
  const { shares } = await farmingPool.methods.recipients(this.account).call();
  return shares * 1;
}
export async function getFarmingShares(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const cache = this.getPoolTokenCache(uniswapV2PairAddress, poolTokenType);
  if (!cache.farmingShares) cache.farmingShares = this.initializeFarmingShares(uniswapV2PairAddress, poolTokenType);
  return cache.farmingShares;
}

// Farming
export async function getFarmingAPY(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType) : Promise<number> {
  const imxPrice = await this.getImxPrice();
  const rewardSpeed = await this.getRewardSpeed(uniswapV2PairAddress, poolTokenType);
  const totalBorrowedUSD = await this.getTotalBorrowsUSD(uniswapV2PairAddress, poolTokenType);
  return this.toAPY(imxPrice * rewardSpeed / totalBorrowedUSD);
}
export async function getNextFarmingAPY(this: ImpermaxRouter, uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, borrowAmount: number) : Promise<number> {
  const farmingAPY = await this.getFarmingAPY(uniswapV2PairAddress, poolTokenType);
  const totalBorrowed = await this.getTotalBorrows(uniswapV2PairAddress, poolTokenType);
  return farmingAPY * totalBorrowed / (totalBorrowed + borrowAmount);
}

// Available Reward
export async function initializeAvailableReward(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<number> {
  const farmingPoolA = await this.getFarmingPool(uniswapV2PairAddress, PoolTokenType.BorrowableA);
  const farmingPoolB = await this.getFarmingPool(uniswapV2PairAddress, PoolTokenType.BorrowableB);
  let totalAmount = 0;
  if (farmingPoolA) totalAmount += await farmingPoolA.methods.claim().call({from: this.account}) / 1e18;
  if (farmingPoolB) totalAmount += await farmingPoolB.methods.claim().call({from: this.account}) / 1e18;
  return totalAmount;
}
export async function getAvailableReward(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<number> {
  const cache = this.getLendingPoolCache(uniswapV2PairAddress);
  if (!cache.availableReward) cache.availableReward = this.initializeAvailableReward(uniswapV2PairAddress);
  return cache.availableReward;
}

// Claim History
export async function initializeClaimHistory(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<ClaimEvent[]> {
  const farmingPoolA = await this.getFarmingPool(uniswapV2PairAddress, PoolTokenType.BorrowableA);
  const farmingPoolB = await this.getFarmingPool(uniswapV2PairAddress, PoolTokenType.BorrowableB);
  const claimsA = await farmingPoolA.getPastEvents("Claim", { fromBlock: 0, filter: {account: this.account} });
  const claimsB = await farmingPoolB.getPastEvents("Claim", { fromBlock: 0, filter: {account: this.account} });
  const claims = claimsA.concat(claimsB);
  claims.sort((a: any, b: any) => b.blockNumber - a.blockNumber); // order from newest to oldest
  const result: Array<ClaimEvent> = [];
  for (const claim of claims) {
    result.push({
      amount: claim.returnValues.amount / 1e18,
      transactionHash: claim.transactionHash,
    });
  }
  return result;
}
export async function getClaimHistory(this: ImpermaxRouter, uniswapV2PairAddress: Address) : Promise<ClaimEvent[]> {
  const cache = this.getLendingPoolCache(uniswapV2PairAddress);
  if (!cache.claimHistory) cache.claimHistory = this.initializeClaimHistory(uniswapV2PairAddress);
  return cache.claimHistory;
}

// Claim Claimable
export async function initializeAvailableClaimable(this: ImpermaxRouter, claimableAddress: Address) : Promise<number> {
  const claimable = await this.getClaimable(claimableAddress);
  return await claimable.methods.claim().call({from: this.account}) / 1e18;
}
export async function getAvailableClaimable(this: ImpermaxRouter, claimableAddress: Address) : Promise<number> {
  const cache = this.getClaimableCache(claimableAddress);
  if (!cache.availableClaimable) cache.availableClaimable = await this.initializeAvailableClaimable(claimableAddress);
  return cache.availableClaimable;
}