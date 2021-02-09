import React from "react";
import './index.scss';
import { formatToDecimals, formatFloat } from "../../utils/format";
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
      {formatFloat(liquidationPrice, 4)}
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
  const price0 = riskMetrics.liquidationPrices[0];
  const price1 = riskMetrics.liquidationPrices[1];
  const TWAPPrice = riskMetrics.TWAPPrice;
  const safetyMargin = riskMetrics.safetyMargin;
  if (!price0 && !price1) return (<>-</>);
  if (price0 >= TWAPPrice || price1 <= TWAPPrice) return (
    <span className={"liquidation-price risk-5"}>Liquidatable</span>
  );

  return (<>
    <LiquidationPrice
      liquidationPrice={price0}
      TWAPPrice={TWAPPrice}
      safetyMargin={safetyMargin}
    /> - <LiquidationPrice
      liquidationPrice={price1}
      TWAPPrice={TWAPPrice}
      safetyMargin={safetyMargin}
    />
  </>);
}