import { useContext } from 'react';
import PairAddressContext from '../contexts/PairAddress';

// ray test touch <<
export default function usePairAddress(): string {
  const uniswapV2PairAddress = useContext(PairAddressContext);
  return uniswapV2PairAddress;
}
// ray test touch >>
