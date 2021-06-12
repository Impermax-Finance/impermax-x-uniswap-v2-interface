
import { useContext } from 'react';

import { NetworkContext } from 'contexts/NetworkProvider';

// ray test touch <<
// export function useAirdropUrl() {
//   const { airdropUrl } = useContext(NetworkContext);
//   return airdropUrl;
// }
// ray test touch >>

export function useDistributors() {
  const { distributors } = useContext(NetworkContext);
  return distributors;
}
