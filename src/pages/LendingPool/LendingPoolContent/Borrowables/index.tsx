
import clsx from 'clsx';

import Borrowable from './Borrowable';
import { PoolTokenType } from 'types/interfaces';

const Borrowables = (): JSX.Element => {
  return (
    <div
      className={clsx(
        'space-y-3',
        'md:space-y-0',
        'md:grid',
        'md:grid-cols-2',
        'md:gap-3'
      )}>
      <Borrowable poolTokenType={PoolTokenType.BorrowableA} />
      <Borrowable poolTokenType={PoolTokenType.BorrowableB} />
    </div>
  );
};

export default Borrowables;
