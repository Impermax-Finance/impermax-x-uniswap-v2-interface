import { useContext, useEffect } from 'react';
import { SubgraphContext } from '../contexts/SubgraphProvider';
import Subgraph from '../subgraph';
import { useRouterUpdate } from './useImpermaxRouter';

export default function useSubgraph() {
  const { subgraph } = useContext(SubgraphContext);
  return subgraph;
}

// ray test touch <
export function useSubgraphCallback(f: (subgraph: Subgraph) => void, a?: Array<any>) {
  // ray test touch <<
  console.log('ray : ***** useSubgraphCallback');
  // ray test touch >>
  const { subgraph } = useContext(SubgraphContext);
  // ray test touch <<
  console.log('ray : ***** subgraph => ', subgraph);
  // ray test touch >>
  const routerUpdate = useRouterUpdate();
  return useEffect(() => {
    if (subgraph) f(subgraph);
  }, [subgraph, routerUpdate].concat(a));
}
// ray test touch >
