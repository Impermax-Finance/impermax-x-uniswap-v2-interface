
import {
  useTWAPPrice,
  useSafetyMargin,
  useLiquidationPrices
} from 'hooks/useData';
import { formatFloat } from 'utils/format';
import { Changes } from 'types/interfaces';
// ray test touch <<
import './index.scss';
// ray test touch >>

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
    safetyFactor > riskFactor * LIQ_K ** 2 ? 'risk-0' :
      safetyFactor > riskFactor * LIQ_K ** 1 ? 'risk-1' :
        safetyFactor > riskFactor * LIQ_K ** 0 ? 'risk-2' :
          safetyFactor > riskFactor * LIQ_K ** -1 ? 'risk-3' :
            safetyFactor > riskFactor * LIQ_K ** -2 ? 'risk-4' :
              'risk-5';

  return (
    <span className={'liquidation-price ' + riskClass}>
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

// ray test touch <<
const LiquidationPrices = ({ changes } : Props): JSX.Element => {
  const [price0, price1] = useLiquidationPrices(changes);
  const TWAPPrice = useTWAPPrice();
  const safetyMargin = useSafetyMargin();

  if (!price0 && !price1) {
    return <>-</>;
  }
  if (price0 >= TWAPPrice || price1 <= TWAPPrice) {
    return (
      <span className='liquidation-price risk-5'>
        Liquidatable
      </span>
    );
  }

  return (
    <>
      <LiquidationPrice
        liquidationPrice={price0}
        TWAPPrice={TWAPPrice}
        safetyMargin={safetyMargin} />
      -
      <LiquidationPrice
        liquidationPrice={price1}
        TWAPPrice={TWAPPrice}
        safetyMargin={safetyMargin} />
    </>
  );
};

export default LiquidationPrices;
// ray test touch >>
