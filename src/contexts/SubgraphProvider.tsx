import React, { createContext } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import Subgraph from 'subgraph';
import {
  useImpermaxSubgraphUrl,
  useWETH,
  useUniswapV2FactoryAddress
} from 'hooks/useNetwork';

export interface SubgraphContextI {
  subgraph?: Subgraph;
}

export const SubgraphContext = createContext<SubgraphContextI>({});

export const SubgraphProvider: React.FC = ({ children }) => {
  const { chainId = 0 } = useWeb3React<Web3Provider>();
  const impermaxSubgraphUrl = useImpermaxSubgraphUrl();
  const WETH = useWETH();
  const uniswapV2FactoryAddress = useUniswapV2FactoryAddress();

  const subgraph = new Subgraph({
    impermaxSubgraphUrl,
    chainId,
    WETH,
    uniswapV2FactoryAddress
  });

  return (
    <SubgraphContext.Provider value={{ subgraph }}>
      {children}
    </SubgraphContext.Provider>
  );
};
