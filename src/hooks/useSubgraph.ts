import { useContext, useEffect } from 'react';
import { SubgraphContext } from '../contexts/SubgraphProvider';
import Subgraph from '../subgraph';
import { useRouterUpdate } from './useImpermaxRouter';

export default function useSubgraph() {
  const { subgraph } = useContext(SubgraphContext);
  return subgraph;
}

export function useSubgraphCallback(f: (subgraph: Subgraph) => void, a?: Array<any>) {
  const { subgraph } = useContext(SubgraphContext);
  const routerUpdate = useRouterUpdate();
  return useEffect(() => {
    if (subgraph) f(subgraph);
  }, [subgraph, routerUpdate].concat(a));
}
