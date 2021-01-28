import React, { createContext, useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import ImpermaxRouter from '../impermax-router';
import useWeb3 from '../hooks/useWeb3';
import { useRouterAddress, useWETH, useConvertToMainnet, useFactoryAddress, useSimpleUniswapOracleAddress, useChainId } from '../hooks/useNetwork';

export interface ImpermaxRouterContextI {
  impermaxRouter?: ImpermaxRouter;
  routerAccount?: string;
}

export const ImpermaxRouterContext = createContext<ImpermaxRouterContextI>({});

export const ImpermaxRouterProvider: React.FC = ({ children }) => {
  const { account } = useWallet();
  const web3 = useWeb3();
  const chainId = useChainId();
  const routerAddress = useRouterAddress();
  const factoryAddress = useFactoryAddress();
  const simpleUniswapOracleAddress = useSimpleUniswapOracleAddress();
  const WETH = useWETH();
  const convertToMainnet = useConvertToMainnet();
  const [impermaxRouter, setImpermaxRouter] = useState<ImpermaxRouter>();
  const [routerAccount, setRouterAccount] = useState<string>();

  useEffect(() => {
    if(!web3) return;
    if (!impermaxRouter) {
      const impermaxRouter = new ImpermaxRouter({
        web3, 
        chainId,
        routerAddress, 
        factoryAddress, 
        simpleUniswapOracleAddress, 
        WETH, 
        convertToMainnet
      });
      if (account) {
        impermaxRouter.unlockWallet(web3, account);
        setRouterAccount(account);
      }
      setImpermaxRouter(impermaxRouter);
    } else if (account) {
      impermaxRouter.unlockWallet(web3, account);
      setRouterAccount(account);
    }
  }, [web3, account]);

  return <ImpermaxRouterContext.Provider value={{ impermaxRouter, routerAccount }}>{children}</ImpermaxRouterContext.Provider>;
};