
import * as React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import Subgraph from 'subgraph';

const SubgraphContext = React.createContext<SubgraphContextInterface | undefined>(undefined);

interface SubgraphProviderProps {
  chainIdOverwrite?: number;
  children: React.ReactNode;
}

const SubgraphProvider = ({
  chainIdOverwrite,
  children
}: SubgraphProviderProps): JSX.Element => {
  let { chainId } = useWeb3React<Web3Provider>();
  if (chainIdOverwrite) chainId = chainIdOverwrite;

  if (!chainId) {
    throw new Error('Invalid chain ID!');
  }

  const subgraph = new Subgraph({ chainId });

  return (
    <SubgraphContext.Provider value={{ subgraph }}>
      {children}
    </SubgraphContext.Provider>
  );
};

export interface SubgraphContextInterface {
  subgraph: Subgraph;
}

export {
  SubgraphContext
};

export default SubgraphProvider;
