
import { useParams } from 'react-router-dom';
import clsx from 'clsx';

import OverallStats from './OverallStats';
import ActionBar from './ActionBar';
import LendingPoolList from './LendingPoolList';
import { PARAMETERS } from 'utils/constants/links';

const Markets = (): JSX.Element => {
  const { [PARAMETERS.CHAIN_ID]: chainIDParam } = useParams<Record<string, string>>();
  const selectedChainID = Number(chainIDParam);

  return (
    <div
      className={clsx(
        'space-y-12',
        'py-6'
      )}>
      <OverallStats chainID={selectedChainID} />
      <ActionBar />
      <LendingPoolList chainID={selectedChainID} />
    </div>
  );
};

export default Markets;
