
import clsx from 'clsx';

import OverallStats from './OverallStats';
import CreateNewMarketLinkButton from './CreateNewMarketLinkButton';
import LendingPoolsSearch from './LendingPoolsSearch';

const Home = (): JSX.Element => {
  return (
    <div
      className={clsx(
        // TODO: could be styled at `Layout` level
        'container',
        'mx-auto',
        'py-8',
        'sm:px-8',
        'space-y-12'
      )}>
      <OverallStats />
      <CreateNewMarketLinkButton />
      <LendingPoolsSearch />
    </div>
  );
};

export default Home;
