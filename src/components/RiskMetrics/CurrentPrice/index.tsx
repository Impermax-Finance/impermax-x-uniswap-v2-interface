
import { RefreshIcon } from '@heroicons/react/outline';
import clsx from 'clsx';

import { DetailListItem } from 'components/DetailList';
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
    <DetailListItem
      title={`TWAP Price (${pair})`}
      tooltip='The TWAP (Time Weighted Average Price) and the current market price on Uniswap.'>
      <span>{formatFloat(TWAPPrice, 4)}</span>
      <span>(current: {formatFloat(marketPrice, 4)})</span>
      <RefreshIcon
        className={clsx(
          'w-6',
          'h-6',
          'cursor-pointer'
        )}
        onClick={() => togglePriceInverted()} />
    </DetailListItem>
  );
};

export default CurrentPrice;
