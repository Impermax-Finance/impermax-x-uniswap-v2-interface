import React, { createContext, useEffect, useState } from 'react';
import Web3 from 'web3';
import { useWallet } from 'use-wallet';
import { provider } from 'web3-core';
import { Networks, chainDetailsMap } from '../utils/connections';
import { NETWORK_URL, WETH, ROUTER, LISTED_PAIRS, Address, FACTORY, SIMPLE_UNISWAP_ORACLE } from '../utils/constants';

export interface NetworkI {
  networkName: string;
  chainId: number;
  networkUrl: string;
  WETH: Address;
  routerAddress: Address;
  factoryAddress: Address;
  simpleUniswapOracleAddress: Address;
  listedPairs: Array<Address>;
}

const NETWORK = process.env.NETWORK as Networks;

const context : NetworkI = {
  networkName: NETWORK,
  chainId: chainDetailsMap[process.env.NETWORK as Networks].networkId,
  networkUrl: NETWORK_URL[NETWORK],
  WETH: WETH[NETWORK],
  routerAddress: ROUTER[NETWORK],
  factoryAddress: FACTORY[NETWORK],
  simpleUniswapOracleAddress: SIMPLE_UNISWAP_ORACLE[NETWORK],
  listedPairs: LISTED_PAIRS[NETWORK],
};

export const NetworkContext = createContext<NetworkI>(context);

const Network: React.FC = ({ children }) => {
  return <NetworkContext.Provider value={context}>{children}</NetworkContext.Provider>;
};

export default Network;