
import * as React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import NetworkConnectModal from './NetworkConnectModal';
import JadeContainedButton from 'components/JadeContainedButton';

const NetworkConnect = (): JSX.Element | null => {
  const [networkModalOpen, setNetworkModalOpen] = React.useState(false);

  const { active } = useWeb3React<Web3Provider>();
  if (!active) return null;

  const handleNetworkModalOpen = () => {
    setNetworkModalOpen(true);
  };

  const handleNetworkModalClose = () => {
    setNetworkModalOpen(false);
  };

  return (
    <>
      <JadeContainedButton onClick={handleNetworkModalOpen}>
        Select a Network
      </JadeContainedButton>
      <NetworkConnectModal
        open={networkModalOpen}
        onClose={handleNetworkModalClose} />
    </>
  );
};

export default NetworkConnect;
