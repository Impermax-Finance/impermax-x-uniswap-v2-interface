
import OverallStats from './OverallStats';
import CreateNewMarketButton from './CreateNewMarketButton';
import LendingPoolsSearch from './LendingPoolsSearch';

const Home = (): JSX.Element => {
  return (
    <>
      <OverallStats />
      <CreateNewMarketButton />
      <LendingPoolsSearch />
    </>
  );
};

export default Home;
