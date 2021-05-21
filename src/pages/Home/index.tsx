
import Layout from 'parts/Layout';
import LendingPoolsSearch from 'components/LendingPoolsSearch';
import OverallStats from 'components/OverallStats';
import CreateNewMarketButton from 'components/CreateNewMarketButton';

const Home = (): JSX.Element => {
  return (
    <Layout>
      <div>
        <OverallStats />
        <CreateNewMarketButton />
        <LendingPoolsSearch />
      </div>
    </Layout>
  );
};

export default Home;
