
import * as React from 'react';

import { SubgraphContext } from 'contexts/SubgraphProvider';
import Subgraph from 'subgraph';
import { useRouterUpdate } from './useImpermaxRouter';

export default function useSubgraph(): Subgraph | undefined {
  const { subgraph } = React.useContext(SubgraphContext);

  return subgraph;
}

// ray test touch <
export function useSubgraphCallback(f: (subgraph: Subgraph) => void, a?: Array<any>) {
  const { subgraph } = React.useContext(SubgraphContext);
  const routerUpdate = useRouterUpdate();
  return React.useEffect(() => {
    if (subgraph) f(subgraph);
  }, [subgraph, routerUpdate].concat(a));
}
// ray test touch >
