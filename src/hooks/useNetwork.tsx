
import { useContext } from 'react';

import { NetworkContext } from 'contexts/NetworkProvider';

export function useClaimAggregatorAddress() {
  const { claimAggregatorAddress } = useContext(NetworkContext);
  return claimAggregatorAddress;
}

export function useAirdropUrl() {
  const { airdropUrl } = useContext(NetworkContext);
  return airdropUrl;
}

export function useDistributors() {
  const { distributors } = useContext(NetworkContext);
  return distributors;
}
