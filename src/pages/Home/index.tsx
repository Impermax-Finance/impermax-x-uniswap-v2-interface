
// ray test touch <<
import * as React from 'react';
// ray test touch >>
import clsx from 'clsx';

import OverallStats from './OverallStats';
import ActionBar from './ActionBar';
import LendingPoolList from './LendingPoolList';
// ray test touch <<
import { SUPPORTED_CHAINS } from 'config/web3/chains';
import { SupportedChain } from 'types/web3/general.d';
// ray test touch >>

const Home = (): JSX.Element => {
  // ray test touch <<
  const [selectedChain, setSelectedChain] = React.useState(SUPPORTED_CHAINS[0]);

  const changeSelectedChain = (newValue: SupportedChain) => {
    setSelectedChain(newValue);
  };
  // ray test touch >>

  return (
    <div
      className={clsx(
        'space-y-12',
        'py-6'
      )}>
      <OverallStats />
      <ActionBar
        selectedChain={selectedChain}
        changeSelectedChain={changeSelectedChain} />
      <LendingPoolList />
    </div>
  );
};

export default Home;
