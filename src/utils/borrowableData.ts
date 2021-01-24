import { ERC20, Borrowable } from "../hooks/useContract"
import BN from "bn.js";

export interface BorrowableData {
  tokenAddress: string;
  symbol: string;
  name: string;
  supply: string;
  borrowed: string;
  utilizationRate: string;
  supplyAPY: string;
  borrowAPY: string;
  //farmingAPY: string;
}

function formatAPY(n: number) : string {
  const SECONDS_IN_YEAR = 365 * 24 * 3600;
  const percentage = n * SECONDS_IN_YEAR / 1e16;
  return (Math.round(percentage * 100) / 100).toFixed(2) + "%";
}

export async function getBorrowableData(token: ERC20, borrowable: Borrowable) : Promise<BorrowableData> {
  const borrowRate = await borrowable.methods.borrowRate().call();
  const totalBorrows = await borrowable.methods.totalBorrows().call();
  const totalBalance = await borrowable.methods.totalBalance().call();
  const supply = totalBalance + totalBorrows;
  const utilizationRate = supply == 0 ? 0 : totalBalance / supply;
  const supplyRate = borrowRate * utilizationRate;
  return {
    tokenAddress: token._address,
    symbol: await token.methods.symbol().call(),
    name: await token.methods.name().call(),
    supply: "$0",
    borrowed: "$0",
    utilizationRate: utilizationRate + "%",
    supplyAPY: formatAPY(supplyRate),
    borrowAPY: formatAPY(borrowRate)
  };
}