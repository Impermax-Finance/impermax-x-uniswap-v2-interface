
import clsx from 'clsx';

import OverallStats from './OverallStats';
import CreateNewMarketLinkButton from './CreateNewMarketLinkButton';
import LendingPoolsSearch from './LendingPoolsSearch';

const Home = (): JSX.Element => {
  return (
    <div
      className={clsx(
        // TODO: should be styled at `Layout` level
        'container',
        'mx-auto',
        'p-8',
        'space-y-12'
      )}>
      <OverallStats />
      <CreateNewMarketLinkButton />
      <LendingPoolsSearch />
    </div>
  );
};

export default Home;
