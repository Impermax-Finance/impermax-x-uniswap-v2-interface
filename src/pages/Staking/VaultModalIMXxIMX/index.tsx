
import * as React from 'react';
import clsx from 'clsx';

import StakingForm from './StakingForm';
import UnstakingForm from './UnstakingForm';
import Tabs, {
  Tab,
  TabPanel
} from 'components/Tabs';
import { InteractionModalContainer } from '../../../components/InteractionModal';

interface VaultModalIMXxIMXProps {
  show: boolean;
  toggleShow(s: boolean): void;
}

const VaultModalIMXxIMX = ({
  show,
  toggleShow
}: VaultModalIMXxIMXProps): JSX.Element => {
  const [selectedTabIndex, setSelectedTabIndex] = React.useState(0);

  const handleTabSelect = (newTabIndex: number) => () => {
    setSelectedTabIndex(newTabIndex);
  };

  return (
    <InteractionModalContainer
      title='Stake IBEX, Earn IBEX'
      show={show}
      toggleShow={toggleShow}>
      <>
        <Tabs
          className={clsx(
            'h-14',
            'grid',
            'grid-cols-2',
            'gap-2',
            'bg-impermaxAstral',
            'px-1.5',
            'py-1',
            'rounded-lg',
            'select-none'
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
              'mt-8',
              'space-y-8'
            )} />
        </TabPanel>
        <TabPanel
          index={1}
          selectedIndex={selectedTabIndex}
          id='unstake-tab-panel'>
          <UnstakingForm
            className={clsx(
              'mt-6',
              'space-y-6'
            )} />
        </TabPanel>
      </>
    </InteractionModalContainer>
  );
};

export default VaultModalIMXxIMX;