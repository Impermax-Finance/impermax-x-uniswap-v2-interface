
import * as React from 'react';
import clsx from 'clsx';

import StakingForm from './StakingForm';
import UnstakingForm from './UnstakingForm';
import Tabs, {
  Tab,
  TabPanel
} from 'components/Tabs';
import Panel from 'components/Panel';

const FormCard = (): JSX.Element => {
  const [selectedTabIndex, setSelectedTabIndex] = React.useState(0);

  const handleTabSelect = (newTabIndex: number) => () => {
    setSelectedTabIndex(newTabIndex);
  };

  return (
    <Panel
      className={clsx(
        'px-6',
        'py-4',
        'bg-impermaxBlackHaze-600'
      )}>
      <Tabs
        className={clsx(
          'h-14',
          'grid',
          'grid-cols-2',
          'gap-2',
          'bg-impermaxBlackHaze-700',
          'px-1.5',
          'py-1',
          'rounded-lg'
        )}>
        <Tab
          id='stake-tab'
          index={0}
          selectedIndex={selectedTabIndex}
          onSelect={handleTabSelect(0)}>
          Stake
        </Tab>
        <Tab
          id='unstake-tab'
          index={1}
          selectedIndex={selectedTabIndex}
          onSelect={handleTabSelect(1)}>
          Unstake
        </Tab>
      </Tabs>
      <TabPanel
        index={0}
        selectedIndex={selectedTabIndex}
        id='stake-tab-panel'>
        <StakingForm
          className={clsx(
            'mt-4',
            'space-y-4'
          )} />
      </TabPanel>
      <TabPanel
        index={1}
        selectedIndex={selectedTabIndex}
        id='unstake-tab-panel'>
        <UnstakingForm
          className={clsx(
            'mt-4',
            'space-y-4'
          )} />
      </TabPanel>
    </Panel>
  );
};

export default FormCard;
