import { useWETH } from "./useNetwork";

export interface UrlGenerator {
  getIconByTokenAddress: Function;
  getUniswapAddLiquidity: Function;
}

export default function useUrlGenerator() {
  const WETH = useWETH();
  return {
    getLendingPool: (address: string) => {
      return "/lending-pool/" + address;
    },
    getIconByTokenAddress: (address: string) => {
      return "/build/assets/icons/" + address + ".svg";
    },
    getUniswapAddLiquidity: (addressA: string, addressB: string) => {
      if (addressA == WETH) addressA = "ETH";
      if (addressB == WETH) addressB = "ETH";
      return "https://app.uniswap.org/#/add/"+addressA+"/"+addressB;
    },
  };
}