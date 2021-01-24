import { useEffect, useState } from 'react';
import useWeb3 from './useWeb3';
import { ContractDefinitions, Contracts, ContractDefinition, NetworkContracts, ImpermaxInterfaces, UniswapPairs } from '../utils/contracts';
import { Networks } from '../utils/connections';
import { map, values, reduce } from 'ramda';
import { Contract } from 'web3-eth-contract';
import CollateralJSON from '../abis/contracts/Collateral.json';
import BorrowableJSON from '../abis/contracts/Borrowable.json';

type StaticContractInstances = {
  [key in Contracts]:  Contract
}

export type LendingPoolContractData = {
  pair: UniswapPairs,
  collateral: Contract,
  borrowable0: Contract,
  borrowable1: Contract
}

type LendingPoolContractInstances = {
  [key in UniswapPairs]: LendingPoolContractData
}

/**
 * Keys for Available Contracts.
 */
export enum ContractInstances {
  StaticContracts = 'staticContracts',
  LendingPoolContracts = 'lendingPoolContracts'
}

export type AvailableContracts = {
  [ContractInstances.StaticContracts]?: StaticContractInstances;
  [ContractInstances.LendingPoolContracts]?: LendingPoolContractInstances;
}

/**
 * Generates a map of contract instances in the given Network Contracts set.
 * @param networkContracts 
 * @param web3 
 * @see NetworkContracts
 */
const generateConstantContracts = (networkContracts: NetworkContracts, web3: any): StaticContractInstances => map(
  (description: ContractDefinition) => (new web3.eth.Contract(description.abi, description.address))
)(networkContracts);


/**
 * Returns a map of lending pool contract instances using the Uniswap Pair contract definitions.
 * @param contractInstances 
 * @param networkContracts 
 * @param web3 
 * @see UniswapPairs
 */
const generateLendingPoolContracts = async (contractInstances: StaticContractInstances, networkContracts: NetworkContracts, web3: any): Promise<LendingPoolContractInstances> => {
  const lendingPoolContractAddresses = await Promise.all(
    values(
      map(
        (pair: UniswapPairs) => contractInstances[ImpermaxInterfaces.Router].methods.getLendingPool(networkContracts[pair].address).call().then(
        (result: any) => {
          const { collateral, borrowable0, borrowable1 } = result;
          return {
            pair,
            collateral: new web3.eth.Contract(CollateralJSON.abi, collateral),
            borrowable0: new web3.eth.Contract(BorrowableJSON.abi, borrowable0),
            borrowable1: new web3.eth.Contract(BorrowableJSON.abi, borrowable1)
          };
        }
      ))(UniswapPairs)
    )
  );

  return reduce((acc: any, result) => {
    acc[result.pair] = result as LendingPoolContractData;
    return acc;
  }, {}, lendingPoolContractAddresses) as LendingPoolContractInstances;
}

/**
 * React hook to setupContract instances.
 */
export default function useContracts() {
  const web3 = useWeb3();
  const [impermax, setImpermax] = useState<AvailableContracts>({});
  const networkContracts = ContractDefinitions[(process.env.NETWORK as Networks)];
  

  const setupContracts = async () => {
    const staticContracts = generateConstantContracts(networkContracts, web3);
    const lendingPoolContracts = await generateLendingPoolContracts(staticContracts, networkContracts, web3);
    setImpermax({
      staticContracts,
      lendingPoolContracts
    });
  }

  useEffect(() => {
    if (web3) setupContracts();
  }, [web3]);

  return impermax;
};