import { useWETH, useChainId } from "./useNetwork";
import usePairAddress from "./usePairAddress";
import { PoolTokenType } from "../impermax-router/interfaces";
import usePoolToken from "./usePoolToken";
import { useUnderlyingAddress } from "./useData";

export function useLendingPoolUrl() : string {
  const uniswapV2PairAddress = usePairAddress();
  return "/lending-pool/" + uniswapV2PairAddress;
}

export function useTokenIcon(poolTokenTypeArg?: PoolTokenType) : string {
  const tokenAddress = useUnderlyingAddress(poolTokenTypeArg);
  return tokenAddress ? "/build/assets/icons/" + tokenAddress + ".png" : "";
}

export function useAddLiquidityUrl() : string {
  const WETH = useWETH();
  const tokenAAddress = useUnderlyingAddress(PoolTokenType.BorrowableA);
  const tokenBAddress = useUnderlyingAddress(PoolTokenType.BorrowableB);
  const addressA = tokenAAddress == WETH ? "ETH" : tokenAAddress;
  const addressB = tokenBAddress == WETH ? "ETH" : tokenBAddress;
  return "https://app.uniswap.org/#/add/"+addressA+"/"+addressB;
}

export function useTransactionUrlGenerator() : (hash: string) => string {
  const chainId = useChainId();
  const subdomain = chainId == 3 ? 'ropsten.' : ''
  return (hash: string) => "https://" + subdomain + "etherscan.io/tx/" + hash;
}

export function useTransactionUrl(hash: string) : string {
  const generator = useTransactionUrlGenerator();
  return generator(hash);
}