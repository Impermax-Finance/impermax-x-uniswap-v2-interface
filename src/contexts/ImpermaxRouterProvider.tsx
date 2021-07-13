
import * as React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import ImpermaxRouter from 'impermax-router';
import useSubgraph from 'hooks/useSubgraph';

const ImpermaxRouterContext = React.createContext<ImpermaxRouterContextInterface | undefined>(undefined);

interface ImpermaxRouterProviderProps {
  appChainId?: number;
  children: React.ReactNode;
}

const ImpermaxRouterProvider = ({
  appChainId,
  children
}: ImpermaxRouterProviderProps): JSX.Element => {
  const {
    account,
    chainId,
    library
  } = useWeb3React<Web3Provider>();
  const subgraph = useSubgraph();
  const [impermaxRouter, setImpermaxRouter] = React.useState<ImpermaxRouter>();
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

  const wrongNetwork = appChainId !== chainId;

  React.useEffect(() => {
    if (!library) return;
    if (!chainId) return;
    if (!account) return;
    if (wrongNetwork) return;
    if (!impermaxRouter) {
      const impermaxRouter = new ImpermaxRouter({
        subgraph,
        library,
        chainId,
        priceInverted
      });
      if (account) {
        impermaxRouter.unlockWallet(library, account);
        doUpdate();
      }
      setImpermaxRouter(impermaxRouter);
    } else if (account) {
      impermaxRouter.unlockWallet(library, account);
      doUpdate();
    }
  }, [library, chainId, account]);

  return (
    <ImpermaxRouterContext.Provider
      value={{
        impermaxRouter,
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
  routerUpdate: number;
  // eslint-disable-next-line @typescript-eslint/ban-types
  doUpdate: Function;
  priceInverted: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  togglePriceInverted: Function;
}

export {
  ImpermaxRouterContext
};

export default ImpermaxRouterProvider;
