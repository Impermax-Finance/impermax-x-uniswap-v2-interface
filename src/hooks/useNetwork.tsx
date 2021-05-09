import { useContext } from 'react';
import { NetworkContext } from '../contexts/Network';

export function useNetworkName() {
  const { networkName } = useContext(NetworkContext);
  return networkName;
}

export function useChainId() {
  const { chainId } = useContext(NetworkContext);
  return chainId;
}

export function useImpermaxSubgraphUrl() {
  const { impermaxSubgraphUrl } = useContext(NetworkContext);
  return impermaxSubgraphUrl;
}

export function useNetworkUrl() {
  const { networkUrl } = useContext(NetworkContext);
  return networkUrl;
}

export function useIMX() {
  const { IMX } = useContext(NetworkContext);
  return IMX;
}

export function useWETH() {
  const { WETH } = useContext(NetworkContext);
  return WETH;
}

export function useRouterAddress() {
  const { routerAddress } = useContext(NetworkContext);
  return routerAddress;
}

export function useFactoryAddress() {
  const { factoryAddress } = useContext(NetworkContext);
  return factoryAddress;
}

export function useUniswapV2FactoryAddress() {
  const { uniswapV2FactoryAddress } = useContext(NetworkContext);
  return uniswapV2FactoryAddress;
}

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
