
// ray test touch <<
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
// ray test touch >>

import { DetailsRowCustom } from '../DetailList';
import QuestionHelper from '../QuestionHelper';
import { PoolTokenType } from 'types/interfaces';
import { useTogglePriceInverted, usePriceInverted } from 'hooks/useImpermaxRouter';
import { formatFloat } from 'utils/format';
import { useSymbol, useTWAPPrice, useMarketPrice } from 'hooks/useData';

/**
 * Generates lending pool aggregate details.
 */

const CurrentPrice = (): JSX.Element => {
  const TWAPPrice = useTWAPPrice();
  const marketPrice = useMarketPrice();

  const priceInverted = usePriceInverted();
  const togglePriceInverted = useTogglePriceInverted();
  const symbolA = useSymbol(PoolTokenType.BorrowableA);
  const symbolB = useSymbol(PoolTokenType.BorrowableB);
  const pair =
    priceInverted ?
      `${symbolB}/${symbolA}` :
      `${symbolA}/${symbolB}`;

  return (
    <DetailsRowCustom>
      <div className='name'>
        TWAP Price ({pair}) <QuestionHelper text='The TWAP (Time Weighted Average Price) and the current market price on Uniswap' />
      </div>
      <div className='value'>{formatFloat(TWAPPrice, 4)} (current: {formatFloat(marketPrice, 4)}) <FontAwesomeIcon
        icon={faSyncAlt}
        className='invert-price'
        onClick={() => togglePriceInverted()} />
      </div>
    </DetailsRowCustom>
  );
};

export default CurrentPrice;
