import React, { createContext, useEffect, useState } from 'react';
import Web3 from 'web3';
import { useWallet } from 'use-wallet';
import { provider } from 'web3-core';
import { Networks, chainDetailsMap } from '../utils/connections';
import { NETWORK_URL, IMX, WETH, ROUTER, Address, FACTORY, SIMPLE_UNISWAP_ORACLE, AIRDROP_URL, MERKLE_DISTRIBUTOR, CLAIM_AGGREGATOR, DistributorDetails, DISTRIBUTORS, IMPERMAX_SUBGRAPH_URL, UNISWAP_V2_FACTORY, WHITELISTED_PAIRS } from '../utils/constants';

export interface NetworkI {
  networkName: string;
  chainId: number;
  impermaxSubgraphUrl: string;
  networkUrl: string;
  IMX: Address;
  WETH: Address;
  routerAddress: Address;
  factoryAddress: Address;
  uniswapV2FactoryAddress: Address;
  simpleUniswapOracleAddress: Address;
  merkleDistributorAddress: Address;
  claimAggregatorAddress: Address;
  airdropUrl: string;
  distributors: DistributorDetails[];
  whitelistedPairs: Address[];
}

const NETWORK = process.env.NETWORK as Networks;

const context : NetworkI = {
  networkName: NETWORK,
  chainId: chainDetailsMap[process.env.NETWORK as Networks].networkId,
  impermaxSubgraphUrl: IMPERMAX_SUBGRAPH_URL[NETWORK],
  networkUrl: NETWORK_URL[NETWORK],
  IMX: IMX[NETWORK],
  WETH: WETH[NETWORK],
  routerAddress: ROUTER[NETWORK],
  factoryAddress: FACTORY[NETWORK],
  uniswapV2FactoryAddress: UNISWAP_V2_FACTORY[NETWORK],
  simpleUniswapOracleAddress: SIMPLE_UNISWAP_ORACLE[NETWORK],
  merkleDistributorAddress: MERKLE_DISTRIBUTOR[NETWORK],
  claimAggregatorAddress: CLAIM_AGGREGATOR[NETWORK],
  airdropUrl: AIRDROP_URL[NETWORK],
  distributors: DISTRIBUTORS[NETWORK],
  whitelistedPairs: WHITELISTED_PAIRS[NETWORK],
};

export const NetworkContext = createContext<NetworkI>(context);

const Network: React.FC = ({ children }) => {
  return <NetworkContext.Provider value={context}>{children}</NetworkContext.Provider>;
};

export default Network;