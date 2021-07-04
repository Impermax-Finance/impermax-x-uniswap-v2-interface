
import * as React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
// ray test touch <<
// import clsx from 'clsx';
// ray test touch >>

import ImpermaxRouter from 'impermax-router';
import useSubgraph from 'hooks/useSubgraph';
// ray test touch <<
// import { ReactComponent as SpinIcon } from 'assets/images/icons/spin.svg';
// const LoadingSpinner = () => (
//   <div
//     className={clsx(
//       'p-7',
//       'flex',
//       'justify-center'
//     )}>
//     <SpinIcon
//       className={clsx(
//         'animate-spin',
//         'w-8',
//         'h-8',
//         'text-impermaxJade'
//       )} />
//   </div>
// );
// ray test touch >>

// ray test touch <<
const ImpermaxRouterContext = React.createContext<ImpermaxRouterContextInterface | undefined>(undefined);
// ray test touch >>

const ImpermaxRouterProvider: React.FC = ({ children }) => {
  const {
    account,
    chainId,
    library
  } = useWeb3React<Web3Provider>();
  const subgraph = useSubgraph();
  // ray test touch <<
  // const [impermaxRouter, setImpermaxRouter] = React.useState<ImpermaxRouter>();
  // const [routerAccount, setRouterAccount] = React.useState<string>();
  // ray test touch >>
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

  // ray test touch <<
  // React.useEffect(() => {
  //   if (!chainId) return;
  //   if (!subgraph) return;
  //   if (!library) return;
  //   if (!impermaxRouter) {
  //     const impermaxRouter = new ImpermaxRouter({
  //       subgraph,
  //       library,
  //       chainId,
  //       priceInverted
  //     });
  //     if (account) {
  //       impermaxRouter.unlockWallet(library, account);
  //       setRouterAccount(account);
  //     }
  //     setImpermaxRouter(impermaxRouter);
  //   } else if (account) {
  //     impermaxRouter.unlockWallet(library, account);
  //     setRouterAccount(account);
  //   }
  // }, [
  //   account,
  //   chainId,
  //   impermaxRouter,
  //   priceInverted,
  //   subgraph,
  //   library
  // ]);
  // ray test touch >>

  // ray test touch <<
  if (!library) {
    throw new Error('Invalid library!');
  }
  if (!chainId) {
    throw new Error('Invalid chain ID!');
  }
  if (!account) {
    throw new Error('Invalid chain ID!');
  }
  const impermaxRouter = new ImpermaxRouter({
    subgraph,
    library,
    chainId,
    priceInverted
  });
  impermaxRouter.unlockWallet(library, account);
  // ray test touch >>

  return (
    <ImpermaxRouterContext.Provider
      value={{
        // ray test touch <<
        impermaxRouter,
        // routerAccount,
        // ray test touch >>
        routerUpdate,
        doUpdate,
        priceInverted,
        togglePriceInverted
      }}>
      {children}
      {/* ray test touch << */}
      {/* TODO: should improve in a more explicit way */}
      {/* {(impermaxRouter && routerAccount) ? (
      ) : (
        <LoadingSpinner />
      )} */}
      {/* ray test touch >> */}
    </ImpermaxRouterContext.Provider>
  );
};

export interface ImpermaxRouterContextInterface {
  impermaxRouter: ImpermaxRouter;
  // ray test touch <<
  // routerAccount: string;
  // ray test touch >>
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
