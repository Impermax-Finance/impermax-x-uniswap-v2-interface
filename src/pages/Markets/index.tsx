
import { useParams } from 'react-router-dom';
import clsx from 'clsx';

import OverallStats from './OverallStats';
import ActionBar from './ActionBar';
import LendingPoolList from './LendingPoolList';
import { PARAMETERS } from 'utils/constants/links';

const Markets = (): JSX.Element => {
  // ray test touch <<
  const { [PARAMETERS.CHAIN_ID]: selectedChainID } = useParams<Record<string, string>>();
  console.log('ray : ***** selectedChainID => ', selectedChainID);
  // ray test touch >>

  return (
    <div
      className={clsx(
        'space-y-12',
        'py-6'
      )}>
      <OverallStats />
      <ActionBar />
      <LendingPoolList />
    </div>
  );
};

export default Markets;
