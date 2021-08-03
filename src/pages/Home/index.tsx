
import clsx from 'clsx';

import OverallStats from './OverallStats';
import CreateNewMarketLinkButton from './CreateNewMarketLinkButton';
import LendingPoolList from './LendingPoolList';

const Home = (): JSX.Element => {
  return (
    <div
      className={clsx(
        'space-y-12',
        'py-6'
      )}>
      <OverallStats />
      <CreateNewMarketLinkButton />
      <LendingPoolList />
    </div>
  );
};

export default Home;
