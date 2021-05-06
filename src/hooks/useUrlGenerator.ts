import { useWETH, useChainId } from "./useNetwork";
import usePairAddress from "./usePairAddress";
import { PoolTokenType } from "../impermax-router/interfaces";
import usePoolToken from "./usePoolToken";
import { useUnderlyingAddress } from "./useData";
import Web3 from "web3";
import { useWallet } from "use-wallet";

export function useLendingPoolUrl() : string {
  const uniswapV2PairAddress = usePairAddress();
  return "/lending-pool/" + uniswapV2PairAddress;
}

export function useThisAccountUrl() : string {
  const { account } = useWallet();
  if (!account) return null;
  return "/account/" + account;
}

export function useTokenIcon(poolTokenTypeArg?: PoolTokenType) : string {
  const tokenAddress = useUnderlyingAddress(poolTokenTypeArg);
  if (!tokenAddress) return "";
  const convertedAddress = tokenAddress.toLowerCase();
  try{
    require(`../assets/icons/${convertedAddress}.png`);
    return `/build/assets/icons/${convertedAddress}.png`;
  }
  catch {
    return "/build/assets/default.png";
  }
}

export function useAddLiquidityUrl() : string {
  const WETH = useWETH();
  const tokenAAddress = useUnderlyingAddress(PoolTokenType.BorrowableA);
  const tokenBAddress = useUnderlyingAddress(PoolTokenType.BorrowableB);
  const addressA = tokenAAddress.toLowerCase() == WETH.toLowerCase() ? "ETH" : tokenAAddress;
  const addressB = tokenBAddress.toLowerCase() == WETH.toLowerCase() ? "ETH" : tokenBAddress;
  return "https://app.uniswap.org/#/add/V2/"+addressA+"/"+addressB;
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