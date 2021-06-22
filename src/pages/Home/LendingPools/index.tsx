
import clsx from 'clsx';
import { useMedia } from 'react-use';

import LendingPool from './LendingPool';
import LendingPoolsHeader from './LendingPoolsHeader';
import PairAddressContext from 'contexts/PairAddress';
import { usePairList } from 'hooks/useData';
// ray test touch <<
import useLendingPools from 'services/hooks/use-lending-pools';
// ray test touch >>
import { BREAKPOINTS } from 'utils/constants/styles';
import { ReactComponent as SpinIcon } from 'assets/images/icons/spin.svg';

const LendingPools = (): JSX.Element => {
  const greaterThanMd = useMedia(`(min-width: ${BREAKPOINTS.md})`);
  // ray test touch <<
  const lendingPools = useLendingPools(); // TODO: directly write the hook here for managing statuses
  const pairList = usePairList();
  console.log('ray : ***** pairList => ', pairList);
  console.log('ray : ***** lendingPools => ', lendingPools);
  // ray test touch >>

  // ray test touch <<
  if (!lendingPools) {
  // ray test touch >>
    return (
      <div
        className={clsx(
          'p-7',
          'flex',
          'justify-center'
        )}>
        <SpinIcon
          className={clsx(
            'animate-spin',
            'w-8',
            'h-8',
            'text-impermaxJade'
          )} />
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      {greaterThanMd && (
        <LendingPoolsHeader className='px-4' />
      )}
      {/* ray test touch << */}
      {lendingPools.map(lendingPool => {
        return (
          <PairAddressContext.Provider
            value={lendingPool.id}
            key={lendingPool.id}>
            <LendingPool
              lendingPool={lendingPool}
              greaterThanMd={greaterThanMd} />
          </PairAddressContext.Provider>
        );
      })}
      {/* {pairList.map((pair: string, index: number) => {
        return (
          <PairAddressContext.Provider
            value={pair}
            key={index}>
            <LendingPool
              greaterThanMd={greaterThanMd} />
          </PairAddressContext.Provider>
        );
      })} */}
      {/* ray test touch >> */}
    </div>
  );
};

export default LendingPools;
