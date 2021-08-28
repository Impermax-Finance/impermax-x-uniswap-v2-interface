
import {
  useTWAPPrice,
  useSafetyMargin,
  useLiquidationPrices
} from 'hooks/useData';
import { formatFloat } from 'utils/format';
import { Changes } from 'types/interfaces';

const LIQ_K = 1.7;

interface LiquidationPriceProps {
  liquidationPrice: number;
  TWAPPrice: number;
  safetyMargin: number;
}

const LiquidationPrice = ({
  liquidationPrice,
  TWAPPrice,
  safetyMargin
} : LiquidationPriceProps) => {
  const safetyFactor =
    liquidationPrice > TWAPPrice ?
      liquidationPrice / TWAPPrice - 1 :
      TWAPPrice / liquidationPrice - 1;
  const riskFactor = safetyMargin - 1;
  const riskClass =
    safetyFactor > riskFactor * LIQ_K ** 2 ? 'text-impermaxEmerald' :
      safetyFactor > riskFactor * LIQ_K ** 1 ? 'text-impermaxInchWorm' :
        safetyFactor > riskFactor * LIQ_K ** 0 ? 'text-impermaxGoldTips' :
          safetyFactor > riskFactor * LIQ_K ** -1 ? 'text-impermaxTreePoppy' :
            safetyFactor > riskFactor * LIQ_K ** -2 ? 'text-impermaxTrinidad' :
              'text-impermaxMilanoRed';

  return (
    <span className={riskClass}>
      {formatFloat(liquidationPrice, 4)}
    </span>
  );
};

interface Props {
  changes?: Changes;
}

/**
 * Generates lending pool aggregate details.
 */

const LiquidationPrices = ({ changes } : Props): JSX.Element => {
  // ray test touch <<
  const [price0, price1] = useLiquidationPrices(changes);
  const TWAPPrice = useTWAPPrice();
  const safetyMargin = useSafetyMargin();
  // ray test touch >>

  if (!price0 && !price1) {
    return <span>-</span>;
  }
  if (price0 >= TWAPPrice || price1 <= TWAPPrice) {
    return (
      <span className='text-impermaxMilanoRed'>
        Liquidatable
      </span>
    );
  }

  return (
    <div className='space-x-1'>
      <LiquidationPrice
        liquidationPrice={price0}
        TWAPPrice={TWAPPrice}
        safetyMargin={safetyMargin} />
      <span>-</span>
      <LiquidationPrice
        liquidationPrice={price1}
        TWAPPrice={TWAPPrice}
        safetyMargin={safetyMargin} />
    </div>
  );
};

export default LiquidationPrices;
