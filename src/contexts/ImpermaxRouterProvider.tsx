import React, { createContext, useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import ImpermaxRouter from '../impermax-router';
import useWeb3 from '../hooks/useWeb3';
import { useRouterAddress, useWETH, useFactoryAddress, useSimpleUniswapOracleAddress, useChainId } from '../hooks/useNetwork';

export interface ImpermaxRouterContextI {
  impermaxRouter?: ImpermaxRouter;
  routerAccount?: string;
  routerUpdate?: number;
  doUpdate?: Function;
  priceInverted?: boolean;
  togglePriceInverted?: Function;
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
  const [impermaxRouter, setImpermaxRouter] = useState<ImpermaxRouter>();
  const [routerAccount, setRouterAccount] = useState<string>();
  const [routerUpdate, setRouterUpdate] = useState<number>(0);
  const [priceInverted, setPriceInverted] = useState<boolean>(false);
  const doUpdate = () => {
    if (!impermaxRouter) return;
    impermaxRouter.cleanCache();
    setRouterUpdate(routerUpdate+1);
  };
  const togglePriceInverted = () => {
    if (!impermaxRouter) return;
    impermaxRouter.setPriceInverted(!priceInverted);
    setPriceInverted(!priceInverted);
  };

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
        priceInverted
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

  return <ImpermaxRouterContext.Provider value={{ 
    impermaxRouter, 
    routerAccount, 
    routerUpdate, 
    doUpdate, 
    priceInverted, 
    togglePriceInverted 
  }}>{children}</ImpermaxRouterContext.Provider>;
};