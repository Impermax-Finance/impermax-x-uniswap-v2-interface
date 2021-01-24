export function formatPercentage(n: number, decimals: number = 2) : string {
  return (Math.round(n * 100) / 100).toFixed(decimals) + "%";
}

export function formatUSD(n: number) : string {
  return "$" + (Math.round(n * 100) / 100).toFixed(2);
}