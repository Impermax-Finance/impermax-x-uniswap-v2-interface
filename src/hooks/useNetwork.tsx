
import { useContext } from 'react';

import { NetworkContext } from 'contexts/NetworkProvider';

export function useDistributors() {
  const { distributors } = useContext(NetworkContext);
  return distributors;
}
