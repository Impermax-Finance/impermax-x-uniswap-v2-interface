export function formatFloat(n: number, precision: number = 6) : string {
  return n.toPrecision(precision);
}

export function formatToDecimals(n: number, decimals: number = 2) : string {
  return (Math.round(n * (10 ** decimals)) / (10 ** decimals)).toFixed(decimals);
}

export function formatPercentage(n: number, decimals: number = 2) : string {
  return formatToDecimals(n * 100, decimals) + "%";
}

export function formatUSD(n: number) : string {
  return "$" + formatToDecimals(n, 2);
}

export function formatLeverage(n: number) : string {
  return (Math.round(n * 100) / 100).toFixed(2) + 'x';
}