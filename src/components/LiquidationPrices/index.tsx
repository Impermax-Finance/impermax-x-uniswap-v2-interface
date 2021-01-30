import React from "react";
import './index.scss';
import { formatToDecimals } from "../../utils/format";
import { RiskMetrics } from "../../impermax-router/interfaces";

const LIQ_K = 1.7;

interface LiquidationPriceProps {
  liquidationPrice: number;
  TWAPPrice: number;
  safetyMargin: number;
}

function LiquidationPrice({liquidationPrice, TWAPPrice, safetyMargin} : LiquidationPriceProps) {
  const safetyFactor = liquidationPrice > TWAPPrice ? liquidationPrice / TWAPPrice - 1 : TWAPPrice / liquidationPrice - 1;
  const riskFactor = safetyMargin - 1;
  const riskClass = 
    safetyFactor > riskFactor * LIQ_K ** 2 ? "risk-0" :
    safetyFactor > riskFactor * LIQ_K ** 1 ? "risk-1" :
    safetyFactor > riskFactor * LIQ_K ** 0 ? "risk-2" :
    safetyFactor > riskFactor * LIQ_K ** -1 ? "risk-3" :
    safetyFactor > riskFactor * LIQ_K ** -2 ? "risk-4" : "risk-5";
  return (
    <span className={"liquidation-price " + riskClass}>
      {formatToDecimals(liquidationPrice, 6)}
    </span>
  );
}

interface LiquidationPricesProps {
  riskMetrics: RiskMetrics;
}

/**
 * Generates lending pool aggregate details.
 */
export default function LiquidationPrices({riskMetrics} : LiquidationPricesProps) {
  if (!riskMetrics.liquidationPrices[0] && !riskMetrics.liquidationPrices[1]) return (<>-</>);
  return (<>
    <LiquidationPrice
      liquidationPrice={riskMetrics.liquidationPrices[0]}
      TWAPPrice={riskMetrics.TWAPPrice}
      safetyMargin={riskMetrics.safetyMargin}
    /> - <LiquidationPrice
      liquidationPrice={riskMetrics.liquidationPrices[1]}
      TWAPPrice={riskMetrics.TWAPPrice}
      safetyMargin={riskMetrics.safetyMargin}
    />
  </>);
}