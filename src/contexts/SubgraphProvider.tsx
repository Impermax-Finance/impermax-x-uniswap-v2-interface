
import * as React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import Subgraph from 'subgraph';
// ray test touch <<
// import { useUniswapV2FactoryAddress } from 'hooks/useNetwork';
// ray test touch >>

const SubgraphContext = React.createContext<SubgraphContextInterface>({});

interface SubgraphProviderProps {
  children: React.ReactNode;
}

const SubgraphProvider = ({
  children
}: SubgraphProviderProps): JSX.Element | null => {
  const { chainId } = useWeb3React<Web3Provider>();

  if (!chainId) {
    throw new Error('Invalid chain ID!');
  }

  // ray test touch <<
  // const uniswapV2FactoryAddress = useUniswapV2FactoryAddress();
  // ray test touch >>

  const subgraph = new Subgraph({
    chainId
    // ray test touch <<
    // uniswapV2FactoryAddress
    // ray test touch >>
  });

  return (
    <SubgraphContext.Provider value={{ subgraph }}>
      {children}
    </SubgraphContext.Provider>
  );
};

export interface SubgraphContextInterface {
  subgraph?: Subgraph;
}

export {
  SubgraphContext
};

export default SubgraphProvider;
