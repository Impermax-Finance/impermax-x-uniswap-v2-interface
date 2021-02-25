import { PoolTokenType, Changes } from "../impermax-router/interfaces";
import usePoolToken from "./usePoolToken";
import usePairAddress from "./usePairAddress";
import { useState } from "react";
import { useRouterCallback } from "./useImpermaxRouter";
import { stringify } from "querystring";
import { BigNumber } from "ethers";
import { decimalToBalance } from "../utils/ether-utils";

export function useToken(poolTokenTypeArg?: PoolTokenType) {
  const uniswapV2PairAddress = usePairAddress();
  const poolTokenType = poolTokenTypeArg ? poolTokenTypeArg : usePoolToken();
  return { uniswapV2PairAddress, poolTokenType };
}

export function useDecimals(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [decimals, setDecimals] = useState<number>();
  useRouterCallback(async (router) => setDecimals( await router.getDecimals(uniswapV2PairAddress, poolTokenType) ));
  return decimals;
}

export function useSymbol(poolTokenTypeArg?: PoolTokenType) : string {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [symbol, setSymbol] = useState<string>("");
  useRouterCallback(async (router) => setSymbol( await router.getSymbol(uniswapV2PairAddress, poolTokenType) ));
  return symbol;
}

export function useName(poolTokenTypeArg?: PoolTokenType) : string {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [name, setName] = useState<string>("");
  useRouterCallback(async (router) => setName( await router.getName(uniswapV2PairAddress, poolTokenType) ));
  return name;
}

export function useExchangeRate(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  useRouterCallback(async (router) => setExchangeRate( await router.getExchangeRate(uniswapV2PairAddress, poolTokenType) ));
  return exchangeRate;
}

export function useSafetyMargin() : number {
  const uniswapV2PairAddress = usePairAddress();
  const [safetyMargin, setSafetyMargin] = useState<number>(1);
  useRouterCallback(async (router) => setSafetyMargin( await router.getSafetyMargin(uniswapV2PairAddress) ));
  return safetyMargin;
}

export function useMarketPrice() : number {
  const uniswapV2PairAddress = usePairAddress();
  const [marketPrice, setMarketPrice] = useState<number>(null);
  useRouterCallback(async (router) => setMarketPrice( await router.getMarketPrice(uniswapV2PairAddress) ));
  return marketPrice;
}

export function useTWAPPrice() : number {
  const uniswapV2PairAddress = usePairAddress();
  const [TWAPPrice, setTWAPPrice] = useState<number>(null);
  useRouterCallback(async (router) => setTWAPPrice( await router.getTWAPPrice(uniswapV2PairAddress) ));
  return TWAPPrice;
}

export function usePriceDenomLP() : [number, number] {
  const uniswapV2PairAddress = usePairAddress();
  const [priceDenomLP, setPriceDenomLP] = useState<[number, number]>([1,1]);
  useRouterCallback(async (router) => setPriceDenomLP( await router.getPriceDenomLP(uniswapV2PairAddress) ));
  return priceDenomLP;
}

export function useUnderlyingAddress(poolTokenTypeArg?: PoolTokenType) : string {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [tokenAddress, setTokenAddress] = useState<string>("");
  useRouterCallback(async (router) => setTokenAddress( (await router.getContracts(uniswapV2PairAddress, poolTokenType))[1]._address ));
  return tokenAddress;
}

export function useSupplyUSD(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [supplyUSD, setSupplyUSD] = useState<number>(0);
  useRouterCallback(async (router) => setSupplyUSD( await router.getSupplyUSD(uniswapV2PairAddress, poolTokenType) ));
  return supplyUSD;
}

export function useTotalBorrowsUSD(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [totalBorrowsUSD, setTotalBorrowsUSD] = useState<number>(0);
  useRouterCallback(async (router) => setTotalBorrowsUSD( await router.getTotalBorrowsUSD(uniswapV2PairAddress, poolTokenType) ));
  return totalBorrowsUSD;
}

export function useUtilizationRate(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [utilizationRate, setUtilizationRate] = useState<number>(0);
  useRouterCallback(async (router) => setUtilizationRate( await router.getUtilizationRate(uniswapV2PairAddress, poolTokenType) ));
  return utilizationRate;
}

export function useSupplyAPY(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [supplyAPY, setSupplyAPY] = useState<number>(0);
  useRouterCallback(async (router) => setSupplyAPY( await router.getSupplyAPY(uniswapV2PairAddress, poolTokenType) ));
  return supplyAPY;
}

export function useBorrowAPY(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [borrowAPY, setBorrowAPY] = useState<number>(0);
  useRouterCallback(async (router) => setBorrowAPY( await router.getBorrowAPY(uniswapV2PairAddress, poolTokenType) ));
  return borrowAPY;
}

export function useDeposited(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [deposited, setDeposited] = useState<number>(0);
  useRouterCallback(async (router) => setDeposited( await router.getDeposited(uniswapV2PairAddress, poolTokenType) ));
  return deposited;
}

export function useDepositedUSD(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [depositedUSD, setDepositedUSD] = useState<number>(0);
  useRouterCallback(async (router) => setDepositedUSD( await router.getDepositedUSD(uniswapV2PairAddress, poolTokenType) ));
  return depositedUSD;
}

export function useBorrowed(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [borrowed, setBorrowed] = useState<number>(0);
  useRouterCallback(async (router) => setBorrowed( await router.getBorrowed(uniswapV2PairAddress, poolTokenType) ));
  return borrowed;
}

export function useBorrowedUSD(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [borrowedUSD, setBorrowedUSD] = useState<number>(0);
  useRouterCallback(async (router) => setBorrowedUSD( await router.getBorrowedUSD(uniswapV2PairAddress, poolTokenType) ));
  return borrowedUSD;
}

export function useAvailableBalance(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [availableBalance, setAvailableBalance] = useState<number>(0);
  useRouterCallback(async (router) => setAvailableBalance( await router.getAvailableBalance(uniswapV2PairAddress, poolTokenType) ));
  return availableBalance;
}

export function useAvailableBalanceUSD(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [availableBalanceUSD, setAvailableBalanceUSD] = useState<number>(0);
  useRouterCallback(async (router) => setAvailableBalanceUSD( await router.getAvailableBalanceUSD(uniswapV2PairAddress, poolTokenType) ));
  return availableBalanceUSD;
}

export function useCurrentLeverage(changes?: Changes) : number {
  const uniswapV2PairAddress = usePairAddress();
  const [leverage, setLeverage] = useState<number>(0);
  useRouterCallback(async (router) => {
    setLeverage( changes 
      ? await router.getNewLeverage(uniswapV2PairAddress, changes)
      : await router.getLeverage(uniswapV2PairAddress) 
    );
  }, [changes]);
  return leverage;
}

export function useLiquidationPrices(changes?: Changes) : [number, number] {
  const uniswapV2PairAddress = usePairAddress();
  const [liquidationPrices, setLiquidationPrices] = useState<[number, number]>([0, 0]);
  useRouterCallback(async (router) => {
    setLiquidationPrices( changes 
      ? await router.getNewLiquidationPrices(uniswapV2PairAddress, changes)
      : await router.getLiquidationPrices(uniswapV2PairAddress) 
    );
  }, [changes]);
  return liquidationPrices;
}

export function useBalanceUSD() : number {
  const uniswapV2PairAddress = usePairAddress();
  const [balanceUSD, setBalanceUSD] = useState<number>(0);
  useRouterCallback(async (router) => setBalanceUSD( await router.getBalanceUSD(uniswapV2PairAddress) ));
  return balanceUSD;
}

export function useSuppliedUSD() : number {
  const uniswapV2PairAddress = usePairAddress();
  const [suppliedUSD, setSuppliedUSD] = useState<number>(0);
  useRouterCallback(async (router) => setSuppliedUSD( await router.getSuppliedUSD(uniswapV2PairAddress) ));
  return suppliedUSD;
}

export function useDebtUSD() : number {
  const uniswapV2PairAddress = usePairAddress();
  const [debtUSD, setDebtUSD] = useState<number>(0);
  useRouterCallback(async (router) => setDebtUSD( await router.getDebtUSD(uniswapV2PairAddress) ));
  return debtUSD;
}

export function useEquityUSD() : number {
  const uniswapV2PairAddress = usePairAddress();
  const [equityUSD, setEquityUSD] = useState<number>(0);
  useRouterCallback(async (router) => setEquityUSD( await router.getEquityUSD(uniswapV2PairAddress) ));
  return equityUSD;
}

export function useLPEquityUSD() : number {
  const uniswapV2PairAddress = usePairAddress();
  const [LPEquityUSD, setLPEquityUSD] = useState<number>(0);
  useRouterCallback(async (router) => setLPEquityUSD( await router.getLPEquityUSD(uniswapV2PairAddress) ));
  return LPEquityUSD;
}

export function useAccountAPY() : number {
  const uniswapV2PairAddress = usePairAddress();
  const [accountAPY, setAccountAPY] = useState<number>(0);
  useRouterCallback(async (router) => setAccountAPY( await router.getAccountAPY(uniswapV2PairAddress) ));
  return accountAPY;
}

export function useBorrowerList() : Array<string> {
  const uniswapV2PairAddress = usePairAddress();
  const [borrowerList, setBorrowerList] = useState<Array<string>>([]);
  useRouterCallback(async (router) => setBorrowerList( await router.getBorrowerList(uniswapV2PairAddress) ));
  return borrowerList;
}

export function useLiquidatableAccounts() : Array<string> {
  const uniswapV2PairAddress = usePairAddress();
  const borrowerList = useBorrowerList();
  useRouterCallback(async (router) => {
    borrowerList.forEach(async (borrower: string) => {
      const [liquidity, shortfall] = await router.getAccountLiquidity(uniswapV2PairAddress, borrower);
      console.log(borrower, liquidity, shortfall);
    })
  }, [borrowerList]);
  return [];
}

export function useMaxWithdrawable(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [maxWithdrawable, setMaxWithdrawable] = useState<number>(0);
  useRouterCallback(async (router) => setMaxWithdrawable( await router.getMaxWithdrawable(uniswapV2PairAddress, poolTokenType) ));
  return maxWithdrawable;
}

export function useMaxBorrowable(poolTokenTypeArg?: PoolTokenType) : number {
  const { uniswapV2PairAddress, poolTokenType } = useToken(poolTokenTypeArg);
  const [maxBorrowable, setMaxBorrowable] = useState<number>(0);
  useRouterCallback(async (router) => setMaxBorrowable( await router.getMaxBorrowable(uniswapV2PairAddress, poolTokenType) ));
  return maxBorrowable;
}

export function useMaxLeverage() : number {
  const uniswapV2PairAddress = usePairAddress();
  const [maxLeverage, setMaxLeverage] = useState<number>(0);
  useRouterCallback(async (router) => setMaxLeverage( await router.getMaxLeverage(uniswapV2PairAddress) ));
  return maxLeverage;
}

export function useMaxDeleverage(slippage: number) : number {
  const uniswapV2PairAddress = usePairAddress();
  const [maxDeleverage, setMaxDeleverage] = useState<number>(0);
  useRouterCallback
    (async (router) => setMaxDeleverage( await router.getMaxDeleverage(uniswapV2PairAddress, 1 + slippage / 100) ),
    [slippage]
  );
  return maxDeleverage;
}

export function useLeverageAmounts(leverage: number, slippage: number) : {bAmountA: number, bAmountB: number, cAmount: number, bAmountAMin: number, bAmountBMin: number, cAmountMin: number} {
  const uniswapV2PairAddress = usePairAddress();
  const [leverageAmounts, setLeverageAmounts] = 
    useState<{bAmountA: number, bAmountB: number, cAmount: number, bAmountAMin: number, bAmountBMin: number, cAmountMin: number}>
    ({bAmountA: 0, bAmountB: 0, cAmount: 0, bAmountAMin: 0, bAmountBMin: 0, cAmountMin: 0});
  useRouterCallback(
    async (router) => setLeverageAmounts( await router.getLeverageAmounts(uniswapV2PairAddress, leverage, 1 + slippage / 100) ),
    [leverage, slippage]
  );
  return leverageAmounts;
}

export function useDeleverageAmounts(deleverage: number, slippage: number) : {bAmountA: number, bAmountB: number, cAmount: number, bAmountAMin: number, bAmountBMin: number} {
  const uniswapV2PairAddress = usePairAddress();
  const [deleverageAmounts, setDeleverageAmounts] = 
    useState<{bAmountA: number, bAmountB: number, cAmount: number, bAmountAMin: number, bAmountBMin: number}>
    ({bAmountA: 0, bAmountB: 0, cAmount: 0, bAmountAMin: 0, bAmountBMin: 0});
  useRouterCallback(
    async (router) => setDeleverageAmounts( await router.getDeleverageAmounts(uniswapV2PairAddress, deleverage, 1 + slippage / 100) ),
    [deleverage, slippage]
  );
  return deleverageAmounts;
}

export function useDeadline() : BigNumber {
  const [deadline, setDeadline] = useState<BigNumber>();
  useRouterCallback(async (router) => setDeadline( router.getDeadline() ));
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
  const decimals = useDecimals(poolTokenTypeArg);
  const exchangeRate = useExchangeRate(poolTokenTypeArg);
  return parseFloat(amount.toString()) * exchangeRate / Math.pow(10, decimals);
}