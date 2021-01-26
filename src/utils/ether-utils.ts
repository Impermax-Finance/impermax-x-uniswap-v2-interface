import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';

export function balanceToDecimal(s: string): string {
  return formatUnits(s);
}

export function decimalToBalance(d: string | number, decimals = 18): BigNumber {
  return parseUnits(String(d), decimals);
}