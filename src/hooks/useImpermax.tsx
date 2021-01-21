import { useEffect, useState } from 'react';
import useWeb3 from './useWeb3';
import ImpermaxABI from './../abis/ImpermaxABI';
import { ContractDefinitions, Contracts, ContractDefinition } from '../utils/contracts';
import { Networks } from '../utils/connections';
import { map } from 'ramda';

type Contract = any;

type ContractInstances = {
  [key in Contracts]: {
    contract: Contract
  }
}

/**
 * React hook to grab an instantiated Impermax contract.
 */
export default function useImpermax() {
  const web3 = useWeb3();
  const networkContracts = ContractDefinitions[(process.env.NETWORK as Networks)];
  const [impermax, setImpermax] = useState<ContractInstances|null>();
  useEffect(() => {
    if (!web3) return;
    const contractInstances = map((description: ContractDefinition) => 
      new web3.eth.Contract(description.abi, description.address))(networkContracts);
    setImpermax(contractInstances);
  }, [web3]);

  return impermax;
};