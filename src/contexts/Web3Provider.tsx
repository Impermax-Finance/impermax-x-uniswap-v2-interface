import React, { createContext, useEffect, useState } from 'react';
import Web3 from 'web3';
import { useWallet } from 'use-wallet';
import { provider } from 'web3-core';
import { Networks } from '../utils/connections';
import { useNetworkUrl } from '../hooks/useNetwork';

export interface Web3ContextI {
  web3: any;
}

export const Web3Context = createContext<Web3ContextI>({ web3: null});

const Web3Provider: React.FC = ({ children }) => {
  const { ethereum, account, connect, networkName } = useWallet<provider>();
  const [web3, setWeb3] = useState<any>();
  const networkUrl = useNetworkUrl();

  useEffect(() => {
    if (ethereum) setWeb3(new Web3(ethereum));
    else {
      const defaultProvider = new Web3.providers.WebsocketProvider( networkUrl );
      setWeb3(new Web3(defaultProvider));
      connect("injected");
    }
  }, [ethereum]);

  return <Web3Context.Provider value={{web3}}>{children}</Web3Context.Provider>;
};

export default Web3Provider;