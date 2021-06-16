// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import * as React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import ImpermaxRouter from 'impermax-router';
import useSubgraph from 'hooks/useSubgraph';

const ImpermaxRouterContext = React.createContext<ImpermaxRouterContextInterface>({});

const ImpermaxRouterProvider: React.FC = ({ children }) => {
  const {
    account,
    chainId,
    library
  } = useWeb3React<Web3Provider>();
  const subgraph = useSubgraph();
  const [impermaxRouter, setImpermaxRouter] = React.useState<ImpermaxRouter>();
  const [routerAccount, setRouterAccount] = React.useState<string>();
  const [routerUpdate, setRouterUpdate] = React.useState<number>(0);
  const [priceInverted, setPriceInverted] = React.useState<boolean>(false);
  const doUpdate = () => {
    if (!impermaxRouter) return;
    impermaxRouter.cleanCache();
    impermaxRouter.subgraph.cleanCache();
    setRouterUpdate(routerUpdate + 1);
  };
  const togglePriceInverted = () => {
    if (!impermaxRouter) return;
    impermaxRouter.setPriceInverted(!priceInverted);
    setPriceInverted(!priceInverted);
  };

  React.useEffect(() => {
    if (!chainId) return;
    if (!subgraph) return;
    if (!library) return;

    if (!impermaxRouter) {
      const impermaxRouter = new ImpermaxRouter({
        subgraph,
        library,
        chainId,
        priceInverted
      });
      if (account) {
        impermaxRouter.unlockWallet(library, account);
        setRouterAccount(account);
      }
      setImpermaxRouter(impermaxRouter);
    } else if (account) {
      impermaxRouter.unlockWallet(library, account);
      setRouterAccount(account);
    }
  }, [
    account,
    chainId,
    impermaxRouter,
    priceInverted,
    subgraph,
    library
  ]);

  return (
    <ImpermaxRouterContext.Provider
      value={{
        impermaxRouter,
        routerAccount,
        routerUpdate,
        doUpdate,
        priceInverted,
        togglePriceInverted
      }}>
      {children}
    </ImpermaxRouterContext.Provider>
  );
};

export interface ImpermaxRouterContextInterface {
  impermaxRouter?: ImpermaxRouter;
  routerAccount?: string;
  routerUpdate?: number;
  // eslint-disable-next-line @typescript-eslint/ban-types
  doUpdate?: Function;
  priceInverted?: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  togglePriceInverted?: Function;
}

export {
  ImpermaxRouterContext
};

export default ImpermaxRouterProvider;
