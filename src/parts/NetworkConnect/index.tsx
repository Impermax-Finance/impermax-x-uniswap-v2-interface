
import * as React from 'react';

import NetworkConnectModal from './NetworkConnectModal';
import JadeContainedButton from 'components/JadeContainedButton';

const NetworkConnect = (): JSX.Element => {
  const [networkModalOpen, setNetworkModalOpen] = React.useState(false);

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
