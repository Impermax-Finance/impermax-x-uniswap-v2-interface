
import React, { createContext } from 'react';
import { Networks } from 'utils/connections';
import {
  Address,
  // ray test touch <<
  // SIMPLE_UNISWAP_ORACLE,
  // ray test touch >>
  AIRDROP_URL,
  MERKLE_DISTRIBUTOR,
  CLAIM_AGGREGATOR,
  DistributorDetails,
  DISTRIBUTORS
} from 'utils/constants';

// ray test touch <
const NETWORK = process.env.REACT_APP_NETWORK as Networks;

const context : NetworkInterface = {
  // ray test touch <<
  // simpleUniswapOracleAddress: SIMPLE_UNISWAP_ORACLE[NETWORK],
  // ray test touch >>
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
  // simpleUniswapOracleAddress: Address;
  // ray test touch >>
  merkleDistributorAddress: Address;
  claimAggregatorAddress: Address;
  airdropUrl: string;
  distributors: DistributorDetails[];
}

export {
  NetworkContext
};

export default NetworkProvider;
