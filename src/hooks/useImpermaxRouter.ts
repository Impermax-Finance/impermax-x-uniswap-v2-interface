
import {
  useContext,
  useEffect
} from 'react';
import { ImpermaxRouterContext } from 'contexts/ImpermaxRouterProvider';
import ImpermaxRouter from '../impermax-router';

// ray test touch <
// TODO: should be one hook
export default function useImpermaxRouter() {
  const context = useContext(ImpermaxRouterContext);

  if (context === undefined) {
    throw new Error('useImpermaxRouter must be used within a ImpermaxRouterProvider');
  }

  return context.impermaxRouter;
}
export function useRouterAccount() {
  const context = useContext(ImpermaxRouterContext);

  if (context === undefined) {
    throw new Error('useRouterAccount must be used within a ImpermaxRouterProvider');
  }

  return context.routerAccount;
}
export function useRouterUpdate() {
  const context = useContext(ImpermaxRouterContext);

  if (context === undefined) {
    throw new Error('useRouterUpdate must be used within a ImpermaxRouterProvider');
  }

  return context.routerUpdate;
}
export function useDoUpdate() {
  const context = useContext(ImpermaxRouterContext);

  if (context === undefined) {
    throw new Error('useDoUpdate must be used within a ImpermaxRouterProvider');
  }

  return context.doUpdate;
}
export function usePriceInverted() {
  const context = useContext(ImpermaxRouterContext);

  if (context === undefined) {
    throw new Error('usePriceInverted must be used within a ImpermaxRouterProvider');
  }

  return context.priceInverted;
}
export function useTogglePriceInverted() {
  const context = useContext(ImpermaxRouterContext);

  if (context === undefined) {
    throw new Error('useTogglePriceInverted must be used within a ImpermaxRouterProvider');
  }

  return context.togglePriceInverted;
}
// ray test touch >

export function useRouterCallback(f: (impermaxRouter: ImpermaxRouter) => void, additionalDeps: Array<any> = []): void {
  const context = useContext(ImpermaxRouterContext);

  if (context === undefined) {
    throw new Error('useRouterCallback must be used within a ImpermaxRouterProvider');
  }

  const {
    impermaxRouter,
    routerAccount,
    routerUpdate,
    priceInverted
  } = context;

  return useEffect(() => {
    if (impermaxRouter) return;
    // if (!f) return;

    f(impermaxRouter);
  }, [
    impermaxRouter,
    routerAccount,
    routerUpdate,
    priceInverted,
    // f,
    ...additionalDeps
  ]);
}
