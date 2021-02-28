function formatSmallNumber(n: number, significant: number = 6) {
    const decimals = - Math.floor(Math.log10(n));
    return "0." + "0".repeat(decimals-1) + (n * Math.pow(10, decimals)).toString().replace(".", "").substring(0, significant);
}

/*
 * Return the number floored to a certain amount of significant digits
 */
export function formatFloat(n: number, significant: number = 6) : string {
  if (n == Infinity) return "Infinity"; //return "∞";
  if (!n) return '0';
  if (n >= 10 ** (significant-1)) return Math.floor(n).toString();
  if (n < 1e-6) return formatSmallNumber(n, significant);
  const rounded = parseFloat(n.toPrecision(significant));
  if (rounded <= n) return rounded.toString();
  const decimals = rounded.toPrecision(significant).split('.')[1].length;
  const floored = rounded - 10 ** (-decimals);
  return parseFloat(floored.toPrecision(significant)).toString();
}

export function formatToDecimals(n: number, decimals: number = 2) : string {
  if (n == Infinity) return "Infinity"; //return "∞";
  return (Math.round(n * (10 ** decimals)) / (10 ** decimals)).toFixed(decimals);
}

export function formatPercentage(n: number, decimals: number = 2) : string {
  return formatToDecimals(n * 100, decimals) + "%";
}

export function formatUSD(n: number) : string {
  if (!n) return "$0";
  if (n < 1000) return "$" + formatToDecimals(n, 2);
  n = Math.round(n);
  let result = "";
  while (n >= 1000) {
    const lastThreeCypher = (1000 + n % 1000).toString().substr(1, 4);
    result = ',' + lastThreeCypher + result;
    n = Math.floor(n / 1000);
  }
  result = n.toString() + result;
  return "$" + result;
}

export function formatLeverage(n: number) : string {
  if (n == Infinity) return "∞";
  return formatToDecimals(n, 2) + 'x';
}