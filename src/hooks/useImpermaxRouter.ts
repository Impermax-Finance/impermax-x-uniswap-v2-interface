import { useContext } from 'react';
import { ImpermaxRouterContext } from '../contexts/ImpermaxRouterProvider';

export default function useImpermaxRouter() {
  const { impermaxRouter } = useContext(ImpermaxRouterContext);
  return impermaxRouter;
};

export function useRouterAccount() {
  const { routerAccount } = useContext(ImpermaxRouterContext);
  return routerAccount;
}