
import React, { createContext } from 'react';
import { Networks } from 'utils/connections';
import {
  Address,
  AIRDROP_URL,
  // ray test touch <<
  // MERKLE_DISTRIBUTOR,
  // ray test touch >>
  CLAIM_AGGREGATOR,
  DistributorDetails,
  DISTRIBUTORS
} from 'utils/constants';

// ray test touch <
const NETWORK = process.env.REACT_APP_NETWORK as Networks;

const context : NetworkInterface = {
  // ray test touch <<
  // merkleDistributorAddress: MERKLE_DISTRIBUTOR[NETWORK],
  // ray test touch >>
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
  // merkleDistributorAddress: Address;
  // ray test touch >
  claimAggregatorAddress: Address;
  airdropUrl: string;
  distributors: DistributorDetails[];
}

export {
  NetworkContext
};

export default NetworkProvider;
