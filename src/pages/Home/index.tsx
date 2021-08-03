
import clsx from 'clsx';

import OverallStats from './OverallStats';
import CreateNewMarketLinkButton from './CreateNewMarketLinkButton';
import LendingPools from './LendingPools';

const Home = (): JSX.Element => {
  return (
    <div
      className={clsx(
        'space-y-12',
        'py-6'
      )}>
      <OverallStats />
      <CreateNewMarketLinkButton />
      <LendingPools />
    </div>
  );
};

export default Home;
