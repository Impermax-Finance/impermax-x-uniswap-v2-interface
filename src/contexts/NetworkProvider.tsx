
import React, { createContext } from 'react';
import { Networks } from 'utils/connections';
import {
  // ray test touch <<
  // AIRDROP_URL,
  // ray test touch >>
  DistributorDetails,
  DISTRIBUTORS
} from 'utils/constants';

// ray test touch <
const NETWORK = process.env.REACT_APP_NETWORK as Networks;

const context : NetworkInterface = {
  // ray test touch <<
  // airdropUrl: AIRDROP_URL[NETWORK],
  // ray test touch >>
  distributors: DISTRIBUTORS[NETWORK]
};
// ray test touch >

const NetworkContext = createContext<NetworkInterface>(context);

const NetworkProvider: React.FC = ({ children }) => {
  return <NetworkContext.Provider value={context}>{children}</NetworkContext.Provider>;
};

export interface NetworkInterface {
  // ray test touch <<
  // airdropUrl: string;
  // ray test touch >>
  distributors: DistributorDetails[];
}

export {
  NetworkContext
};

export default NetworkProvider;
