import React, { useEffect, useState, useMemo } from 'react';
import Web3 from 'web3';
import { useWallet } from 'use-wallet';
import { provider } from 'web3-core';
import { Networks } from '../utils/connections';
import { NETWORK_URL } from '../utils/constants';

/**
 * Hook to return a connected Web3 instance if the wallet is connected.
 */
export default function useWeb3() {
  const [web3, setWeb3] = useState<any>();
  const { ethereum } = useWallet<provider>();
  const defaultProvider = new Web3.providers.WebsocketProvider( NETWORK_URL[process.env.NETWORK as Networks] );

  useEffect(() => {
    if (ethereum) setWeb3(new Web3(ethereum));
    else setWeb3(new Web3(defaultProvider));
  }, [ethereum]);
  return web3;
}