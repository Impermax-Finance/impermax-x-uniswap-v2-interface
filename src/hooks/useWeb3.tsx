import { useContext } from 'react';
import { Web3Context } from '../contexts/Web3Provider';

export default function useWeb3() {
  const { web3 } = useContext(Web3Context);
  return web3;
}
