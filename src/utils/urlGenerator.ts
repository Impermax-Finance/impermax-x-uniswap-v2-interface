import { WETH } from "./constants";
import { Networks } from "./connections";

export function getIconByTokenAddress(address: string) {
  return "/build/assets/icons/" + address + ".svg";
}

export function getUniswapAddLiquidity(addressA: string, addressB: string) {
  const addressWETH = WETH[process.env.NETWORK as Networks];
  if (addressA == addressWETH) addressA = "ETH";
  if (addressB == addressWETH) addressB = "ETH";
  return "https://app.uniswap.org/#/add/"+addressA+"/"+addressB;
}