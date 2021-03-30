import Subgraph from ".";

export function toAPY(this: Subgraph, n: number) : number {
  const SECONDS_IN_YEAR = 365 * 24 * 3600;
  return n * SECONDS_IN_YEAR;
}