
import clsx from 'clsx';

import BorrowableDetails from './BorrowableDetails';
import PoolTokenContext from 'contexts/PoolToken';
import { PoolTokenType } from 'types/interfaces';

// ray test touch <<
const BorrowablesDetails = (): JSX.Element => {
  return (
    <div
      className={clsx(
        'space-y-3',
        'md:space-y-0',
        'md:grid',
        'md:grid-cols-2',
        'md:gap-3'
      )}>
      <PoolTokenContext.Provider value={PoolTokenType.BorrowableA}>
        <BorrowableDetails />
      </PoolTokenContext.Provider>
      <PoolTokenContext.Provider value={PoolTokenType.BorrowableB}>
        <BorrowableDetails />
      </PoolTokenContext.Provider>
    </div>
  );
};
// ray test touch >>

export default BorrowablesDetails;
