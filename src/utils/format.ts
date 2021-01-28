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

export function formatLiquidationPrices(liquidationPrices: [number, number]) : string {
  if (!liquidationPrices[0] || !liquidationPrices[1]) return '-';
  // Notice both prices should have the same number of decimals
  return formatToDecimals(liquidationPrices[0], 6) + ' - ' + formatToDecimals(liquidationPrices[1], 6);
}