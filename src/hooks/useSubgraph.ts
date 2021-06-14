
import * as React from 'react';

import { SubgraphContext } from 'contexts/SubgraphProvider';
import Subgraph from 'subgraph';
import { useRouterUpdate } from './useImpermaxRouter';

export default function useSubgraph(): Subgraph {
  const context = React.useContext(SubgraphContext);
  if (context === undefined) {
    throw new Error('useSubgraph must be used within a SubgraphProvider!');
  }

  return context.subgraph;
}

// ray test touch <
export function useSubgraphCallback(f: (subgraph: Subgraph) => void, a?: Array<any>) {
  const context = React.useContext(SubgraphContext);
  if (context === undefined) {
    throw new Error('useSubgraphCallback must be used within a SubgraphProvider!');
  }

  const routerUpdate = useRouterUpdate();
  return React.useEffect(() => {
    if (context.subgraph) f(context.subgraph);
  }, [context.subgraph, routerUpdate].concat(a));
}
// ray test touch >
