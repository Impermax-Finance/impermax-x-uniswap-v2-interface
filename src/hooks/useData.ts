// ray test touch <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// ray test touch >

import { PoolTokenType, Changes, AirdropData, ClaimEvent, Address } from '../impermax-router/interfaces';
import usePoolToken from './usePoolToken';
import usePairAddress from './usePairAddress';
import { useState, useEffect } from 'react';
import { useRouterCallback } from './useImpermaxRouter';
import { BigNumber } from 'ethers';
import { decimalToBalance } from '../utils/ether-utils';
import { useSubgraphCallback } from './useSubgraph';
import { InputAddressState } from '../views/CreateNewPair';

export function useToken(poolTokenTypeArg?: PoolTokenType) {
  const uniswapV2PairAddress = usePairAddress();
  // ray test touch <
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const poolTokenType = poolTokenTypeArg ? poolTokenTypeArg : usePoolToken();
  // ray test touch >
  return { uniswapV2PairAddress, poolTokenType };
}

export function usePairList() : Address[] {
  const [pairList, setPairList] = useState<Address[]>();
  useSubgraphCallback(async subgraph => setPairList(await subgraph.getPairList()));
  return pairList;
}

export function useDecimals(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [decimals, setDecimals] = useState<number>();
  useSubgraphCallback(async subgraph => setDecimals(await subgraph.getDecimals(uniswapV2PairAddress, poolTokenType)));
  return decimals;
}

export function useSymbol(poolTokenTypeArg?: PoolTokenType) : string {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [symbol, setSymbol] = useState<string>('');
  useSubgraphCallback(async subgraph => setSymbol(await subgraph.getSymbol(uniswapV2PairAddress, poolTokenType)));
  return symbol;
}

export function useName(poolTokenTypeArg?: PoolTokenType) : string {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [name, setName] = useState<string>('');
  useSubgraphCallback(async subgraph => setName(await subgraph.getName(uniswapV2PairAddress, poolTokenType)));
  return name;
}

export function useExchangeRate(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  useRouterCallback(async router => setExchangeRate(await router.getExchangeRate(uniswapV2PairAddress, poolTokenType)));
  return exchangeRate;
}

export function useStoredExchangeRate(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [storedExchangeRate, setStoredExchangeRate] = useState<number>(1);
  useSubgraphCallback(async subgraph => setStoredExchangeRate(await subgraph.getExchangeRate(uniswapV2PairAddress, poolTokenType)));
  return storedExchangeRate;
}

export function useStoredBorrowIndex(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [storedBorrowIndex, setStoredBorrowIndex] = useState<number>(1);
  useSubgraphCallback(async subgraph => setStoredBorrowIndex(await subgraph.getBorrowIndex(uniswapV2PairAddress, poolTokenType)));
  return storedBorrowIndex;
}

export function useSafetyMargin() : number {
  const uniswapV2PairAddress = usePairAddress();
  const [safetyMargin, setSafetyMargin] = useState<number>(1);
  useSubgraphCallback(async subgraph => setSafetyMargin(await subgraph.getSafetyMargin(uniswapV2PairAddress)));
  return safetyMargin;
}

export function useTokenPrice(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [tokenPrice, setTokenPrice] = useState<number>(null);
  useSubgraphCallback(async subgraph => setTokenPrice(await subgraph.getTokenPrice(uniswapV2PairAddress, poolTokenType)));
  return tokenPrice;
}

export function useImxPrice() : number {
  const [imxPrice, setImxPrice] = useState<number>(null);
  useSubgraphCallback(async subgraph => setImxPrice(await subgraph.getImxPrice()));
  return imxPrice;
}

export function useMarketPrice() : number {
  const uniswapV2PairAddress = usePairAddress();
  const [marketPrice, setMarketPrice] = useState<number>(null);
  useRouterCallback(async router => setMarketPrice(await router.getMarketPrice(uniswapV2PairAddress)));
  return marketPrice;
}

export function useOracleIsInitialized() : boolean {
  const uniswapV2PairAddress = usePairAddress();
  const [oracleIsInitialied, setOracleIsInitialized] = useState<boolean>(true);
  useRouterCallback(async router => setOracleIsInitialized(await router.getTWAPPrice(uniswapV2PairAddress) !== 0));
  return oracleIsInitialied;
}

export function useTWAPPrice() : number {
  const uniswapV2PairAddress = usePairAddress();
  const [TWAPPrice, setTWAPPrice] = useState<number>(null);
  useRouterCallback(async router => setTWAPPrice(await router.getTWAPPrice(uniswapV2PairAddress)));
  return TWAPPrice;
}

export function usePriceDenomLP() : [number, number] {
  const uniswapV2PairAddress = usePairAddress();
  const [priceDenomLP, setPriceDenomLP] = useState<[number, number]>([1, 1]);
  useRouterCallback(async router => setPriceDenomLP(await router.getPriceDenomLP(uniswapV2PairAddress)));
  return priceDenomLP;
}

export function useUnderlyingAddress(poolTokenTypeArg?: PoolTokenType) : string {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [tokenAddress, setTokenAddress] = useState<string>('');
  useSubgraphCallback(async subgraph => setTokenAddress(await subgraph.getUnderlyingAddress(uniswapV2PairAddress, poolTokenType)));
  return tokenAddress;
}

export function useTotalBalanceUSD(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [totalBalanceUSD, setTotalBalanceUSD] = useState<number>(0);
  useSubgraphCallback(async subgraph => setTotalBalanceUSD(await subgraph.getTotalBalanceUSD(uniswapV2PairAddress, poolTokenType)));
  return totalBalanceUSD;
}

export function useSupplyUSD(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [supplyUSD, setSupplyUSD] = useState<number>(0);
  useSubgraphCallback(async subgraph => setSupplyUSD(await subgraph.getSupplyUSD(uniswapV2PairAddress, poolTokenType)));
  return supplyUSD;
}

export function useTotalBorrowsUSD(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [totalBorrowsUSD, setTotalBorrowsUSD] = useState<number>(0);
  useSubgraphCallback(async subgraph => setTotalBorrowsUSD(await subgraph.getTotalBorrowsUSD(uniswapV2PairAddress, poolTokenType)));
  return totalBorrowsUSD;
}

export function useUtilizationRate(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [utilizationRate, setUtilizationRate] = useState<number>(0);
  useSubgraphCallback(async subgraph => setUtilizationRate(await subgraph.getUtilizationRate(uniswapV2PairAddress, poolTokenType)));
  return utilizationRate;
}

export function useSupplyAPY(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [supplyAPY, setSupplyAPY] = useState<number>(0);
  useSubgraphCallback(async subgraph => setSupplyAPY(await subgraph.getSupplyAPY(uniswapV2PairAddress, poolTokenType)));
  return supplyAPY;
}

export function useBorrowAPY(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [borrowAPY, setBorrowAPY] = useState<number>(0);
  useSubgraphCallback(async subgraph => setBorrowAPY(await subgraph.getBorrowAPY(uniswapV2PairAddress, poolTokenType)));
  return borrowAPY;
}

export function useUniswapAPY() : number {
  const uniswapV2PairAddress = usePairAddress();
  const [uniswapAPY, setUniswapAPY] = useState<number>(0);
  useSubgraphCallback(async subgraph => setUniswapAPY(await subgraph.getUniswapAPY(uniswapV2PairAddress)));
  return uniswapAPY;
}

export function useTotalValueLocked() : number {
  const [totalValueLocked, setTotalValueLocked] = useState<number>(0);
  useSubgraphCallback(async subgraph => setTotalValueLocked(await subgraph.getTotalValueLocked()));
  return totalValueLocked;
}

export function useTotalValueSupplied() : number {
  const [totalValueSupplied, setTotalValueSupplied] = useState<number>(0);
  useSubgraphCallback(async subgraph => setTotalValueSupplied(await subgraph.getTotalValueSupplied()));
  return totalValueSupplied;
}

export function useTotalValueBorrowed() : number {
  const [totalValueBorrowed, setTotalValueBorrowed] = useState<number>(0);
  useSubgraphCallback(async subgraph => setTotalValueBorrowed(await subgraph.getTotalValueBorrowed()));
  return totalValueBorrowed;
}

export function useFarmingAPY(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [farmingAPY, setFarmingAPY] = useState<number>(0);
  useSubgraphCallback(async subgraph => setFarmingAPY(await subgraph.getFarmingAPY(uniswapV2PairAddress, poolTokenType)));
  return farmingAPY;
}

export function useHasFarming(poolTokenTypeArg?: PoolTokenType) : boolean {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [farmingPool, setFarmingPool] = useState<number>(0);
  useRouterCallback(async router => setFarmingPool(await router.getFarmingPool(uniswapV2PairAddress, poolTokenType)));
  return farmingPool ? true : false;
}

export function useNextSupplyAPY(supplyAmount: number, poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [nextSupplyAPY, setNextSupplyAPY] = useState<number>(0);
  useSubgraphCallback(
    async subgraph => setNextSupplyAPY(await subgraph.getNextSupplyAPY(uniswapV2PairAddress, poolTokenType, supplyAmount)),
    [supplyAmount]
  );
  return nextSupplyAPY;
}

export function useNextBorrowAPY(borrowAmount: number, poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [nextBorrowAPY, setNextBorrowAPY] = useState<number>(0);
  useSubgraphCallback(
    async subgraph => setNextBorrowAPY(await subgraph.getNextBorrowAPY(uniswapV2PairAddress, poolTokenType, borrowAmount)),
    [borrowAmount]
  );
  return nextBorrowAPY;
}

export function useNextFarmingAPY(borrowAmount: number, poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [nextFarmingAPY, setNextFarmingAPY] = useState<number>(0);
  useSubgraphCallback(
    async subgraph => setNextFarmingAPY(await subgraph.getNextFarmingAPY(uniswapV2PairAddress, poolTokenType, borrowAmount)),
    [borrowAmount]
  );
  return nextFarmingAPY;
}

export function useRewardSpeed(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [rewardSpeed, setRewardSpeed] = useState<number>(0);
  useSubgraphCallback(async subgraph => setRewardSpeed(await subgraph.getRewardSpeed(uniswapV2PairAddress, poolTokenType)));
  return rewardSpeed;
}

export function useFarmingShares(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [farmingShares, setFarmingShares] = useState<number>(0);
  useRouterCallback(async router => setFarmingShares(await router.getFarmingShares(uniswapV2PairAddress, poolTokenType)));
  return farmingShares;
}

export function useIsValidPair(uniswapV2PairAddress: Address) : InputAddressState {
  const [inputAddressState, setInputAddressState] = useState<InputAddressState>(InputAddressState.INVALID_ADDRESS);
  const [toCheckUniswapV2PairAddress, setToCheckUniswapV2PairAddress] = useState<string>();
  useEffect(() => {
    // eslint-disable-next-line no-negated-condition
    if (!/^0x[a-fA-F0-9]{40}$/g.test(uniswapV2PairAddress)) {
      setInputAddressState(InputAddressState.INVALID_ADDRESS);
      setToCheckUniswapV2PairAddress('');
    } else {
      setInputAddressState(InputAddressState.LOADING);
      setToCheckUniswapV2PairAddress(uniswapV2PairAddress);
    }
  }, [uniswapV2PairAddress]);
  useRouterCallback(async router => {
    const isValidPair = await router.isValidPair(toCheckUniswapV2PairAddress);
    if (isValidPair) setInputAddressState(InputAddressState.VALID);
    else setInputAddressState(InputAddressState.INVALID_PAIR);
  }, [toCheckUniswapV2PairAddress]);
  return inputAddressState;
}

export function usePairSymbols(uniswapV2PairAddress: Address) : {symbol0: string, symbol1: string} {
  const [pairSymbols, setPairSymbols] = useState<{symbol0: string, symbol1: string}>({ symbol0: '', symbol1: '' });
  useRouterCallback(async router => {
    setPairSymbols(await router.getPairSymbols(uniswapV2PairAddress));
  }, [uniswapV2PairAddress]);
  return pairSymbols;
}

export function useIsPoolTokenCreated(uniswapV2PairAddress: Address, poolTokenType: PoolTokenType, updater = 0) : boolean {
  const [isPoolTokenCreated, setIsPoolTokenCreated] = useState<boolean>(false);
  useRouterCallback(async router => {
    setIsPoolTokenCreated(await router.isPoolTokenCreated(uniswapV2PairAddress, poolTokenType));
  }, [uniswapV2PairAddress, updater]);
  return isPoolTokenCreated;
}

export function useIsPairInitialized(uniswapV2PairAddress: Address, updater = 0) : boolean {
  const [isPairInitialized, setIsPairInitialized] = useState<boolean>(false);
  useRouterCallback(async router => {
    setIsPairInitialized(await router.isPairInitialized(uniswapV2PairAddress));
  }, [uniswapV2PairAddress, updater]);
  return isPairInitialized;
}

export function useAvailableReward() : number {
  const uniswapV2PairAddress = usePairAddress();
  const [availableReward, setAvailableReward] = useState<number>(0);
  useRouterCallback(async router => setAvailableReward(await router.getAvailableReward(uniswapV2PairAddress)));
  return availableReward;
}

export function useDeposited(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [deposited, setDeposited] = useState<number>(0);
  useRouterCallback(async router => setDeposited(await router.getDeposited(uniswapV2PairAddress, poolTokenType)));
  return deposited;
}

export function useDepositedUSD(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [depositedUSD, setDepositedUSD] = useState<number>(0);
  useRouterCallback(async router => setDepositedUSD(await router.getDepositedUSD(uniswapV2PairAddress, poolTokenType)));
  return depositedUSD;
}

export function useBorrowed(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [borrowed, setBorrowed] = useState<number>(0);
  useRouterCallback(async router => setBorrowed(await router.getBorrowed(uniswapV2PairAddress, poolTokenType)));
  return borrowed;
}

export function useBorrowedUSD(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [borrowedUSD, setBorrowedUSD] = useState<number>(0);
  useRouterCallback(async router => setBorrowedUSD(await router.getBorrowedUSD(uniswapV2PairAddress, poolTokenType)));
  return borrowedUSD;
}

export function useAvailableBalance(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [availableBalance, setAvailableBalance] = useState<number>(0);
  useRouterCallback(async router => setAvailableBalance(await router.getAvailableBalance(uniswapV2PairAddress, poolTokenType)));
  return availableBalance;
}

export function useAvailableBalanceUSD(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [availableBalanceUSD, setAvailableBalanceUSD] = useState<number>(0);
  useRouterCallback(async router => setAvailableBalanceUSD(await router.getAvailableBalanceUSD(uniswapV2PairAddress, poolTokenType)));
  return availableBalanceUSD;
}

export function useCurrentLeverage(changes?: Changes) : number {
  const uniswapV2PairAddress = usePairAddress();
  const [leverage, setLeverage] = useState<number>(0);
  useRouterCallback(async router => {
    setLeverage(changes ?
      await router.getNewLeverage(uniswapV2PairAddress, changes) :
      await router.getLeverage(uniswapV2PairAddress)
    );
  }, [changes]);
  return leverage;
}

export function useLiquidationPrices(changes?: Changes) : [number, number] {
  const uniswapV2PairAddress = usePairAddress();
  const [liquidationPrices, setLiquidationPrices] = useState<[number, number]>([0, 0]);
  useRouterCallback(async router => {
    setLiquidationPrices(changes ?
      await router.getNewLiquidationPrices(uniswapV2PairAddress, changes) :
      await router.getLiquidationPrices(uniswapV2PairAddress)
    );
  }, [changes]);
  return liquidationPrices;
}

export function useBalanceUSD() : number {
  const uniswapV2PairAddress = usePairAddress();
  const [balanceUSD, setBalanceUSD] = useState<number>(0);
  useRouterCallback(async router => setBalanceUSD(await router.getBalanceUSD(uniswapV2PairAddress)));
  return balanceUSD;
}

export function useSuppliedUSD() : number {
  const uniswapV2PairAddress = usePairAddress();
  const [suppliedUSD, setSuppliedUSD] = useState<number>(0);
  useRouterCallback(async router => setSuppliedUSD(await router.getSuppliedUSD(uniswapV2PairAddress)));
  return suppliedUSD;
}

export function useDebtUSD() : number {
  const uniswapV2PairAddress = usePairAddress();
  const [debtUSD, setDebtUSD] = useState<number>(0);
  useRouterCallback(async router => setDebtUSD(await router.getDebtUSD(uniswapV2PairAddress)));
  return debtUSD;
}

export function useEquityUSD() : number {
  const uniswapV2PairAddress = usePairAddress();
  const [equityUSD, setEquityUSD] = useState<number>(0);
  useRouterCallback(async router => setEquityUSD(await router.getEquityUSD(uniswapV2PairAddress)));
  return equityUSD;
}

export function useLPEquityUSD() : number {
  const uniswapV2PairAddress = usePairAddress();
  const [LPEquityUSD, setLPEquityUSD] = useState<number>(0);
  useRouterCallback(async router => setLPEquityUSD(await router.getLPEquityUSD(uniswapV2PairAddress)));
  return LPEquityUSD;
}

export function useAccountAPY() : number {
  const uniswapV2PairAddress = usePairAddress();
  const [accountAPY, setAccountAPY] = useState<number>(0);
  useRouterCallback(async router => setAccountAPY(await router.getAccountAPY(uniswapV2PairAddress)));
  return accountAPY;
}

export function useClaimHistory() : ClaimEvent[] {
  const uniswapV2PairAddress = usePairAddress();
  const [claimHistory, setClaimHistory] = useState<ClaimEvent[]>([]);
  useRouterCallback(async router => setClaimHistory(await router.getClaimHistory(uniswapV2PairAddress)));
  return claimHistory;
}

export function useAirdropData() : AirdropData {
  const [airdropData, setAirdropData] = useState<AirdropData>();
  useRouterCallback(async router => setAirdropData(await router.getAirdropData()));
  return airdropData;
}

export function useHasClaimableAirdrop() : boolean {
  const [hasClaimableAirdrop, setHasClaimableAirdrop] = useState<boolean>(false);
  useRouterCallback(async router => setHasClaimableAirdrop(await router.hasClaimableAirdrop()));
  return hasClaimableAirdrop;
}

export function useAvailableClaimable(claimableAddress: Address) : number {
  const [availableClaimable, setAvailableClaimable] = useState<number>();
  useRouterCallback(async router => setAvailableClaimable(await router.getAvailableClaimable(claimableAddress)));
  return availableClaimable;
}

export function useMaxWithdrawable(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [maxWithdrawable, setMaxWithdrawable] = useState<number>(0);
  useRouterCallback(async router => setMaxWithdrawable(await router.getMaxWithdrawable(uniswapV2PairAddress, poolTokenType)));
  return maxWithdrawable;
}

export function useMaxBorrowable(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [maxBorrowable, setMaxBorrowable] = useState<number>(0);
  useRouterCallback(async router => setMaxBorrowable(await router.getMaxBorrowable(uniswapV2PairAddress, poolTokenType)));
  return maxBorrowable;
}

export function useMaxLeverage() : number {
  const uniswapV2PairAddress = usePairAddress();
  const [maxLeverage, setMaxLeverage] = useState<number>(0);
  useRouterCallback(async router => setMaxLeverage(await router.getMaxLeverage(uniswapV2PairAddress)));
  return maxLeverage;
}

export function useMaxDeleverage(slippage: number) : number {
  const uniswapV2PairAddress = usePairAddress();
  const [maxDeleverage, setMaxDeleverage] = useState<number>(0);
  useRouterCallback(async router => setMaxDeleverage(await router.getMaxDeleverage(uniswapV2PairAddress, 1 + slippage / 100)),
    [slippage]
  );
  return maxDeleverage;
}

export function useLeverageAmounts(leverage: number, slippage: number) : {bAmountA: number, bAmountB: number, cAmount: number, bAmountAMin: number, bAmountBMin: number, cAmountMin: number} {
  const uniswapV2PairAddress = usePairAddress();
  const [leverageAmounts, setLeverageAmounts] =
    useState<{bAmountA: number, bAmountB: number, cAmount: number, bAmountAMin: number, bAmountBMin: number, cAmountMin: number}>({ bAmountA: 0, bAmountB: 0, cAmount: 0, bAmountAMin: 0, bAmountBMin: 0, cAmountMin: 0 });
  useRouterCallback(
    async router => setLeverageAmounts(await router.getLeverageAmounts(uniswapV2PairAddress, leverage, 1 + slippage / 100)),
    [leverage, slippage]
  );
  return leverageAmounts;
}

export function useDeleverageAmounts(deleverage: number, slippage: number) : {bAmountA: number, bAmountB: number, cAmount: number, bAmountAMin: number, bAmountBMin: number} {
  const uniswapV2PairAddress = usePairAddress();
  const [deleverageAmounts, setDeleverageAmounts] =
    useState<{bAmountA: number, bAmountB: number, cAmount: number, bAmountAMin: number, bAmountBMin: number}>({ bAmountA: 0, bAmountB: 0, cAmount: 0, bAmountAMin: 0, bAmountBMin: 0 });
  useRouterCallback(
    async router => setDeleverageAmounts(await router.getDeleverageAmounts(uniswapV2PairAddress, deleverage, 1 + slippage / 100)),
    [deleverage, slippage]
  );
  return deleverageAmounts;
}

export function useDeadline() : BigNumber {
  const [deadline, setDeadline] = useState<BigNumber>();
  useRouterCallback(async router => setDeadline(router.getDeadline()));
  return deadline;
}

export function useToBigNumber(val: number, poolTokenTypeArg?: PoolTokenType) : BigNumber {
  const decimals = useDecimals(poolTokenTypeArg);
  return decimalToBalance(val, decimals);
}

export function useToNumber(amount: BigNumber, poolTokenTypeArg?: PoolTokenType) : number {
  const decimals = useDecimals(poolTokenTypeArg);
  return parseFloat(amount.toString()) / Math.pow(10, decimals);
}

export function useToTokens(val: number, poolTokenTypeArg?: PoolTokenType) : BigNumber {
  const decimals = useDecimals(poolTokenTypeArg);
  const exchangeRate = useExchangeRate(poolTokenTypeArg);
  return decimalToBalance(val / exchangeRate, decimals);
}

export function usefromTokens(amount: BigNumber, poolTokenTypeArg?: PoolTokenType) : number {
  // ray test touch <
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const decimals = useDecimals(poolTokenTypeArg);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const exchangeRate = useExchangeRate(poolTokenTypeArg);
  // ray test touch >
  return parseFloat(amount.toString()) * exchangeRate / Math.pow(10, decimals);
}
