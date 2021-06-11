
import * as React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import Subgraph from 'subgraph';
import {
  // ray test touch <<
  // useWETH,
  // ray test touch >>
  useUniswapV2FactoryAddress
} from 'hooks/useNetwork';

const SubgraphContext = React.createContext<SubgraphContextInterface>({});

interface SubgraphProviderProps {
  children: React.ReactNode;
}

const SubgraphProvider = ({
  children
}: SubgraphProviderProps): JSX.Element | null => {
  const { chainId } = useWeb3React<Web3Provider>();
  // ray test touch <<
  // const WETH = useWETH();
  // ray test touch >>
  const uniswapV2FactoryAddress = useUniswapV2FactoryAddress();

  if (!chainId) {
    throw new Error('Invalid chain ID!');
  }

  const subgraph = new Subgraph({
    chainId,
    // ray test touch <<
    // WETH,
    // ray test touch >>
    uniswapV2FactoryAddress
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
  SubgraphContext,
  SubgraphProvider
};
