// ray test touch <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// ray test touch >

import { useContext } from 'react';
import { LanguageContext } from '../../contexts/Language';
import phrases from './translations';
import { PoolTokenType } from '../../impermax-router/interfaces';
import { useTogglePriceInverted, usePriceInverted } from '../../hooks/useImpermaxRouter';
import { formatFloat } from '../../utils/format';
import { DetailsRowCustom } from '../DetailsRow';
import { useSymbol, useTWAPPrice, useMarketPrice } from '../../hooks/useData';
import QuestionHelper from '../QuestionHelper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';

/**
 * Generates lending pool aggregate details.
 */

export default function CurrentPrice(): JSX.Element {
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const t = (s: string) => (phrases[s][language]);

  const TWAPPrice = useTWAPPrice();
  const marketPrice = useMarketPrice();

  const priceInverted = usePriceInverted();
  const togglePriceInverted = useTogglePriceInverted();
  const symbolA = useSymbol(PoolTokenType.BorrowableA);
  const symbolB = useSymbol(PoolTokenType.BorrowableB);
  // eslint-disable-next-line no-negated-condition
  const pair = !priceInverted ? symbolA + '/' + symbolB : symbolB + '/' + symbolA;

  return (
    <DetailsRowCustom>
      <div className='name'>
        {t('TWAP Price')} ({pair}) <QuestionHelper text='The TWAP (Time Weighted Average Price) and the current market price on Uniswap' />
      </div>
      <div className='value'>{formatFloat(TWAPPrice, 4)} (current: {formatFloat(marketPrice, 4)}) <FontAwesomeIcon
        icon={faSyncAlt}
        className='invert-price'
        onClick={() => togglePriceInverted()} />
      </div>
    </DetailsRowCustom>
  );
}
