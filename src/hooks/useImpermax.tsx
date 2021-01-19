import { useEffect, useState } from 'react';
import useWeb3 from './useWeb3';
import ImpermaxABI from './../abis/ImpermaxABI';

interface ImpermaxContracts {
  core?: any,
  periphery?: any
}

/**
 * React hook to grab an instantiated Impermax contract.
 */
export default function useImpermax() {
  const web3 = useWeb3();
  const [impermax, setImpermax] = useState<ImpermaxContracts>({ core: undefined, periphery: undefined});

  useEffect(() => {
    if (!web3) return;
    const data = {
      core: new web3.eth.Contract(ImpermaxABI),
      periphery: new web3.eth.Contract(ImpermaxABI),
    };
    setImpermax(data);
  }, []);

  return impermax;
};