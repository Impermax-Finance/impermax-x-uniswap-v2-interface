
import React, { createContext } from 'react';
import { Networks } from 'utils/connections';
import {
  // ray test touch <<
  // ROUTER,
  // ray test touch >>
  Address,
  FACTORY,
  SIMPLE_UNISWAP_ORACLE,
  AIRDROP_URL,
  MERKLE_DISTRIBUTOR,
  CLAIM_AGGREGATOR,
  DistributorDetails,
  DISTRIBUTORS,
  UNISWAP_V2_FACTORY
} from 'utils/constants';

// ray test touch <
const NETWORK = process.env.REACT_APP_NETWORK as Networks;

const context : NetworkInterface = {
  // ray test touch <<
  // routerAddress: ROUTER[NETWORK],
  // ray test touch >>
  factoryAddress: FACTORY[NETWORK],
  uniswapV2FactoryAddress: UNISWAP_V2_FACTORY[NETWORK],
  simpleUniswapOracleAddress: SIMPLE_UNISWAP_ORACLE[NETWORK],
  merkleDistributorAddress: MERKLE_DISTRIBUTOR[NETWORK],
  claimAggregatorAddress: CLAIM_AGGREGATOR[NETWORK],
  airdropUrl: AIRDROP_URL[NETWORK],
  distributors: DISTRIBUTORS[NETWORK]
};
// ray test touch >

const NetworkContext = createContext<NetworkInterface>(context);

const NetworkProvider: React.FC = ({ children }) => {
  return <NetworkContext.Provider value={context}>{children}</NetworkContext.Provider>;
};

export interface NetworkInterface {
  // ray test touch <<
  // routerAddress: Address;
  // ray test touch >>
  factoryAddress: Address;
  uniswapV2FactoryAddress: Address;
  simpleUniswapOracleAddress: Address;
  merkleDistributorAddress: Address;
  claimAggregatorAddress: Address;
  airdropUrl: string;
  distributors: DistributorDetails[];
}

export {
  NetworkContext
};

export default NetworkProvider;
