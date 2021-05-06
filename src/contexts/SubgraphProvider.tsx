import React, { createContext, useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import Subgraph from '../subgraph';
import { useChainId, useImpermaxSubgraphUrl, useWETH, useIMX, useUniswapV2FactoryAddress, useWhitelistedPairs } from '../hooks/useNetwork';

export interface SubgraphContextI {
  subgraph?: Subgraph;
}

export const SubgraphContext = createContext<SubgraphContextI>({});

export const SubgraphProvider: React.FC = ({ children }) => {
  const chainId = useChainId();
  const impermaxSubgraphUrl = useImpermaxSubgraphUrl();
  const WETH = useWETH();
  const IMX = useIMX();
  const uniswapV2FactoryAddress = useUniswapV2FactoryAddress();
  const whitelistedPairs = useWhitelistedPairs();

  const subgraph = new Subgraph({
    impermaxSubgraphUrl,
    chainId,
    WETH, 
    IMX,
    uniswapV2FactoryAddress,
    whitelistedPairs,
  });

  return <SubgraphContext.Provider value={{ 
    subgraph, 
  }}>{children}</SubgraphContext.Provider>;
};