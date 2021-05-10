
import View from 'components/View';
import LendingPoolsSearch from 'components/LendingPoolsSearch';
import OverallStats from 'components/OverallStats';
import CreateNewMarketButton from 'components/CreateNewMarketButton';

const Home = (): JSX.Element => {
  return (
    <View>
      <div>
        <OverallStats />
        <CreateNewMarketButton />
        <LendingPoolsSearch />
      </div>
    </View>
  );
};

export default Home;
