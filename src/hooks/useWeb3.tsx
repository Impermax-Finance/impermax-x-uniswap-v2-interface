import React, { useEffect, useState, useMemo } from 'react';
import Web3 from 'web3';
import { useWallet } from 'use-wallet';
import { provider } from 'web3-core';

/**
 * Hook to return a connected Web3 instance if the wallet is connected.
 */
export default function useWeb3() {
  const [web3, setWeb3] = useState<any>();
  const { ethereum } = useWallet<provider>()
  useEffect(() => {
    if (!ethereum) return;
    setWeb3((new Web3(ethereum)));
  }, [ethereum]);
  return web3;
}