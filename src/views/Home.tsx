import View from '../components/View';
import LendingPoolsSearch from '../components/LendingPoolsSearch';
import OverallStats from '../components/OverallStats';
import CreateNewMarketButton from '../components/CreateNewMarketButton';

/**
 * Home page view.
 */

export default function Home() {
  return (
    <View>
      <div className='home'>
        <OverallStats />
        <CreateNewMarketButton />
        <LendingPoolsSearch />
      </div>
    </View>
  );
}
