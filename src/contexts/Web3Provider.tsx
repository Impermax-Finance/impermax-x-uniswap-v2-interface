
import React, { createContext, useEffect, useState } from 'react';
import Web3 from 'web3';
import { useWallet } from 'use-wallet';
import { provider } from 'web3-core';

const Web3Provider: React.FC = ({ children }) => {
  const { ethereum, connect } = useWallet<provider>();
  const [web3, setWeb3] = useState<any>();

  useEffect(() => {
    if (!connect) return;

    if (ethereum) {
      setWeb3(new Web3(ethereum));
    } else {
      connect('injected');
    }
  }, [
    ethereum,
    connect
  ]);

  return <Web3Context.Provider value={{ web3 }}>{children}</Web3Context.Provider>;
};

export interface Web3ContextI {
  web3: any;
}

export const Web3Context = createContext<Web3ContextI>({ web3: null });

export default Web3Provider;
