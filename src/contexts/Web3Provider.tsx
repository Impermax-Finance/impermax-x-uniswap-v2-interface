import React, { createContext, useEffect, useState } from 'react';
import Web3 from 'web3';
import { useWallet } from 'use-wallet';
import { provider } from 'web3-core';

const Web3Provider: React.FC = ({ children }) => {
  const { ethereum, connect } = useWallet<provider>();
  const [web3, setWeb3] = useState<any>();
  // ray test touch <
  // const networkUrl = useNetworkUrl();
  // ray test touch >

  useEffect(() => {
    if (ethereum) setWeb3(new Web3(ethereum));
    else {
      // const defaultProvider = new Web3.providers.WebsocketProvider( networkUrl );
      // setWeb3(new Web3(defaultProvider));
      connect('injected');
    }
  }, [ethereum]);

  return <Web3Context.Provider value={{ web3 }}>{children}</Web3Context.Provider>;
};

export interface Web3ContextI {
  web3: any;
}

export const Web3Context = createContext<Web3ContextI>({ web3: null });

export default Web3Provider;
