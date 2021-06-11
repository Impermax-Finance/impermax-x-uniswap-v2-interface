
import { useContext } from 'react';

import { NetworkContext } from 'contexts/NetworkProvider';

// ray test touch <<
// export function useUniswapV2FactoryAddress() {
//   const { uniswapV2FactoryAddress } = useContext(NetworkContext);
//   return uniswapV2FactoryAddress;
// }
// ray test touch >>

export function useSimpleUniswapOracleAddress() {
  const { simpleUniswapOracleAddress } = useContext(NetworkContext);
  return simpleUniswapOracleAddress;
}

export function useMerkleDistributorAddress() {
  const { merkleDistributorAddress } = useContext(NetworkContext);
  return merkleDistributorAddress;
}

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
