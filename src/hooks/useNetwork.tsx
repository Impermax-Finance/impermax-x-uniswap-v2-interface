import { useContext } from 'react';
import { NetworkContext } from '../contexts/Network';

export function useChainId() {
  const { chainId } = useContext(NetworkContext);
  return chainId;
}

export function useNetworkUrl() {
  const { networkUrl } = useContext(NetworkContext);
  return networkUrl;
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

export function useSimpleUniswapOracleAddress() {
  const { simpleUniswapOracleAddress } = useContext(NetworkContext);
  return simpleUniswapOracleAddress;
}

export function useListedPairs() {
  const { listedPairs } = useContext(NetworkContext);
  return listedPairs;
}