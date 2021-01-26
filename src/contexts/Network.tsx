import React, { createContext, useEffect, useState } from 'react';
import Web3 from 'web3';
import { useWallet } from 'use-wallet';
import { provider } from 'web3-core';
import { Networks, chainDetailsMap } from '../utils/connections';
import { NETWORK_URL, WETH, ROUTER, LISTED_PAIRS, Address, CONVERT_TO_MAINNET } from '../utils/constants';

export interface NetworkI {
  chainId: number;
  networkUrl: string;
  WETH: Address;
  routerAddress: Address;
  listedPairs: Array<Address>;
  convertToMainnet: Function,
}

const NETWORK = process.env.NETWORK as Networks;

const context : NetworkI = {
  chainId: chainDetailsMap[process.env.NETWORK as Networks].networkId,
  networkUrl: NETWORK_URL[NETWORK],
  WETH: WETH[NETWORK],
  routerAddress: ROUTER[NETWORK],
  listedPairs: LISTED_PAIRS[NETWORK],
  convertToMainnet: (address: Address) => {
    const converter = CONVERT_TO_MAINNET[NETWORK];
    if (address in converter) return converter[address];
    return address;
  }
};

export const NetworkContext = createContext<NetworkI>(context);

const Network: React.FC = ({ children }) => {
  return <NetworkContext.Provider value={context}>{children}</NetworkContext.Provider>;
};

export default Network;