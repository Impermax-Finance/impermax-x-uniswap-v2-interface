
import clsx from 'clsx';

import OverallStats from './OverallStats';
import CreateNewMarketLinkButton from './CreateNewMarketLinkButton';
import LendingPools from './LendingPools';

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
      <LendingPools />
    </div>
  );
};

export default Home;
