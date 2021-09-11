
// import { RefreshIcon } from '@heroicons/react/outline';
// import clsx from 'clsx';

import { DetailListItem } from 'components/DetailList';
import { PoolTokenType } from 'types/interfaces';
import {
  // ray test touch <<
  // useTogglePriceInverted,
  // ray test touch >>
  usePriceInverted
} from 'hooks/useImpermaxRouter';
import { formatFloat } from 'utils/format';
import {
  useSymbol,
  useMarketPrice
} from 'hooks/useData';

/**
 * Generates lending pool aggregate details.
 */

interface Props {
  twapPrice: number;
}

const CurrentPrice = ({
  twapPrice
}: Props): JSX.Element => {
  const marketPrice = useMarketPrice();

  const priceInverted = usePriceInverted();
  // ray test touch <<
  // const togglePriceInverted = useTogglePriceInverted();
  // ray test touch >>
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
      <span>{formatFloat(twapPrice, 4)}</span>
      <span>(current: {formatFloat(marketPrice, 4)})</span>
      {/* ray test touch << */}
      {/* <RefreshIcon
        className={clsx(
          'w-6',
          'h-6',
          'cursor-pointer'
        )}
        onClick={() => togglePriceInverted()} /> */}
      {/* ray test touch >> */}
    </DetailListItem>
  );
};

export default CurrentPrice;
