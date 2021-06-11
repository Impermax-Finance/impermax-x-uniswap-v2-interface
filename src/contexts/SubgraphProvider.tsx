import React, { createContext } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import Subgraph from 'subgraph';
import {
  // ray test touch <<
  // useWETH,
  // ray test touch >>
  useUniswapV2FactoryAddress
} from 'hooks/useNetwork';

export interface SubgraphContextI {
  subgraph?: Subgraph;
}

export const SubgraphContext = createContext<SubgraphContextI>({});

export const SubgraphProvider: React.FC = ({ children }) => {
  const { chainId = 0 } = useWeb3React<Web3Provider>();
  // ray test touch <<
  // const WETH = useWETH();
  // ray test touch >>
  const uniswapV2FactoryAddress = useUniswapV2FactoryAddress();

  const subgraph =
    chainId ?
      new Subgraph({
        chainId,
        // ray test touch <<
        // WETH,
        // ray test touch >>
        uniswapV2FactoryAddress
      }) : undefined;

  return (
    <SubgraphContext.Provider value={{ subgraph }}>
      {children}
    </SubgraphContext.Provider>
  );
};
