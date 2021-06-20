
import { Spinner } from 'react-bootstrap';

import LendingPool from './LendingPool';
import LendingPoolsHeader from './LendingPoolsHeader';
import PairAddressContext from 'contexts/PairAddress';
import { usePairList } from 'hooks/useData';
import './index.scss';

const LendingPools = (): JSX.Element => {
  const pairList = usePairList();

  if (!pairList) {
    return (
      // ray test touch <<
      <div className='spinner-container'>
        <Spinner animation='border' />
      </div>
      // ray test touch >>
    );
  }

  return (
    <div className='space-y-3'>
      <LendingPoolsHeader className='px-4' />
      {pairList.map((pair: string, key: any) => {
        return (
          <PairAddressContext.Provider
            value={pair}
            key={key}>
            <LendingPool />
          </PairAddressContext.Provider>
        );
      })}
    </div>
  );
};

export default LendingPools;
