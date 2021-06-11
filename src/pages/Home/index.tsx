
import LendingPoolsSearch from 'components/LendingPoolsSearch';
import OverallStats from 'components/OverallStats';
import CreateNewMarketButton from 'components/CreateNewMarketButton';

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
