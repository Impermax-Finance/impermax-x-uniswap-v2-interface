
export function impermanentLoss(priceSwing: number) {
  return Math.sqrt(priceSwing) / (priceSwing + 1) * 2;
}
