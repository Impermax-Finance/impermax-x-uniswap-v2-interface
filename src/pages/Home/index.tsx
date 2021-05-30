
import Layout from 'parts/Layout';
import LendingPoolsSearch from 'components/LendingPoolsSearch';
import OverallStats from 'components/OverallStats';
import CreateNewMarketButton from 'components/CreateNewMarketButton';

const Home = (): JSX.Element => {
  return (
    <Layout>
      <OverallStats />
      <CreateNewMarketButton />
      <LendingPoolsSearch />
    </Layout>
  );
};

export default Home;
