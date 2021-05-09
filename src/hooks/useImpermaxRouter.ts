import { useContext, useEffect } from 'react';
import { ImpermaxRouterContext } from '../contexts/ImpermaxRouterProvider';
import ImpermaxRouter from '../impermax-router';

export default function useImpermaxRouter() {
  const { impermaxRouter } = useContext(ImpermaxRouterContext);
  return impermaxRouter;
}

export function useRouterAccount() {
  const { routerAccount } = useContext(ImpermaxRouterContext);
  return routerAccount;
}

export function useRouterUpdate() {
  const { routerUpdate } = useContext(ImpermaxRouterContext);
  return routerUpdate;
}

export function useDoUpdate() {
  const { doUpdate } = useContext(ImpermaxRouterContext);
  return doUpdate;
}

export function usePriceInverted() {
  const { priceInverted } = useContext(ImpermaxRouterContext);
  return priceInverted;
}

export function useTogglePriceInverted() {
  const { togglePriceInverted } = useContext(ImpermaxRouterContext);
  return togglePriceInverted;
}

export function useRouterCallback(f: (impermaxRouter: ImpermaxRouter) => void, a?: Array<any>) {
  const { impermaxRouter, routerAccount, routerUpdate, priceInverted } = useContext(ImpermaxRouterContext);
  return useEffect(() => {
    if (impermaxRouter) f(impermaxRouter);
  }, [impermaxRouter, routerAccount, routerUpdate, priceInverted].concat(a));
}
