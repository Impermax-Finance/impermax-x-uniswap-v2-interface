import { useContext, useEffect } from 'react';
import { ImpermaxRouterContext } from '../contexts/ImpermaxRouterProvider';
import ImpermaxRouter from '../impermax-router';

export default function useImpermaxRouter() {
  const { impermaxRouter } = useContext(ImpermaxRouterContext);
  return impermaxRouter;
};

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

export function useRouterCallback(f: (impermaxRouter: ImpermaxRouter) => void, a?: Array<any>) {
  const { impermaxRouter, routerAccount, routerUpdate } = useContext(ImpermaxRouterContext);
  useEffect(() => {
    if (impermaxRouter) f(impermaxRouter);
  }, [impermaxRouter, routerAccount, routerUpdate].concat(a))
}