
import * as React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import NetworkConnectModal from './NetworkConnectModal';
import ImpermaxDefaultOutlinedButton from 'components/buttons/ImpermaxDefaultOutlinedButton';
import ImpermaxImage from 'components/UI/ImpermaxImage';
import {
  NETWORK_ICON_PATHS,
  NETWORK_LABELS
} from 'config/web3/networks';

const NetworkConnect = (): JSX.Element | null => {
  const [networkModalOpen, setNetworkModalOpen] = React.useState(false);

  const {
    active,
    chainId
  } = useWeb3React<Web3Provider>();
  if (!active) return null;

  if (!chainId) {
    throw new Error('Invalid chain ID!');
  }

  const handleNetworkModalOpen = () => {
    setNetworkModalOpen(true);
  };

  const handleNetworkModalClose = () => {
    setNetworkModalOpen(false);
  };

  return (
    <>
      <ImpermaxDefaultOutlinedButton
        style={{
          height: 36
        }}
        onClick={handleNetworkModalOpen}
        startIcon={
          <ImpermaxImage
            className='rounded'
            style={{
              width: 18,
              height: 18
            }}
            src={NETWORK_ICON_PATHS[chainId]}
            alt='Switch Network' />
        }>
        {NETWORK_LABELS[chainId]}
      </ImpermaxDefaultOutlinedButton>
      <NetworkConnectModal
        open={networkModalOpen}
        onClose={handleNetworkModalClose} />
    </>
  );
};

export default NetworkConnect;
