import React, { createContext } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import Subgraph from 'subgraph';
import {
  // ray test touch <<
  // useImpermaxSubgraphUrl,
  // ray test touch >>
  useWETH,
  useUniswapV2FactoryAddress
} from 'hooks/useNetwork';

export interface SubgraphContextI {
  subgraph?: Subgraph;
}

export const SubgraphContext = createContext<SubgraphContextI>({});

export const SubgraphProvider: React.FC = ({ children }) => {
  const { chainId = 0 } = useWeb3React<Web3Provider>();
  // ray test touch <<
  // const impermaxSubgraphUrl = useImpermaxSubgraphUrl();
  // ray test touch >>
  const WETH = useWETH();
  const uniswapV2FactoryAddress = useUniswapV2FactoryAddress();

  const subgraph =
    chainId ?
      new Subgraph({
        // ray test touch <<
        // impermaxSubgraphUrl,
        // ray test touch >>
        chainId,
        WETH,
        uniswapV2FactoryAddress
      }) : undefined;

  return (
    <SubgraphContext.Provider value={{ subgraph }}>
      {children}
    </SubgraphContext.Provider>
  );
};
