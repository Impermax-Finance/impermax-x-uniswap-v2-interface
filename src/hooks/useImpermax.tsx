import React, { useEffect, useState, useMemo } from 'react';
import Web3 from 'web3';
import useWeb3 from './useWeb3';

export class Impermax {
  constructor(public web3: Web3) {
    this.web3 = web3;
    
  }
}


/**
 * React hook to grab an instantiated Impermax contract.
 */
export default function useImpermax() {
  const web3 = useWeb3();
  const [impermax, setImpermax] = useState();

  useEffect(() => {
    if (!web3) return;
  }, []);

  return impermax;
};