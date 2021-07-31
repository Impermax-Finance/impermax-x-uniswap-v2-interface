
import OverallStats from './OverallStats';
import CreateNewMarketLinkButton from './CreateNewMarketLinkButton';
import LendingPools from './LendingPools';

const Home = (): JSX.Element => {
  return (
    <div className='space-y-12'>
      <OverallStats />
      <CreateNewMarketLinkButton />
      <LendingPools />
    </div>
  );
};

export default Home;
