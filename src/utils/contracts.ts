import { Networks } from './connections';
import UniswapV2PairJSON from '../abis/contracts/UniswapV2Pair.json';
import Router01JSON from '../abis/contracts/Router01.json';
import { Currency, ETH, DAI } from './currency';

export interface ContractDefinition {
  address?: string;
  abi: any;
}



export enum UniswapPairs {
  EthDai = 'eth-dai',
}

export interface UniswapPair {
  name: UniswapPairs;
  currency1: Currency;
  currency2: Currency;
}

export type UniswapPairData = {
  [key in UniswapPairs]: UniswapPair;
}

export const UniswapPairData: UniswapPairData = {
  [UniswapPairs.EthDai] : {
    name: UniswapPairs.EthDai,
    currency1: ETH,
    currency2: DAI
  }
};

export enum ImpermaxInterfaces {
  Router = 'router',
}

/**
 * A union of Uniswap Pair contracts and Impermax contract.
 * @see ImpermaxInterfaces
 * @see UniswapPairs
 */
export type Contracts = UniswapPairs | ImpermaxInterfaces;

export type NetworkContracts = {
  [key in Contracts]: ContractDefinition
};

export type ContractDefinitions = {
  [key in Networks]: NetworkContracts
};

export const ContractDefinitions: ContractDefinitions = {
  [Networks.Ropsten]: {
    [UniswapPairs.EthDai] : {
      address: '0x1c5dee94a34d795f9eeef830b68b80e44868d316', 
      abi: UniswapV2PairJSON.abi
    },
    [ImpermaxInterfaces.Router] : {
      address: '0xA48C6262890A45ef1a523Cf617AA6E816cf4e72A', 
      abi: Router01JSON.abi
    }
  },
  [Networks.Mainnet]: {
    [UniswapPairs.EthDai] : {
      address: '', 
      abi: {}
    },
    [ImpermaxInterfaces.Router] : {
      address: '', 
      abi: {}
    }
  }
}