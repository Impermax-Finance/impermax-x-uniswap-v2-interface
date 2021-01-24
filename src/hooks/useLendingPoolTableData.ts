import { pipe, compose, map, mapObjIndexed, values } from 'ramda';
import { UniswapPairs, UniswapPairData } from '../utils/contracts';
import { Currency } from '../utils/currency';
import useContracts, { LendingPoolContractData, ContractInstances } from './useContracts';
import { useEffect, useState } from 'react';


/**
 * Data about a specific currency in a lending pool.
 */
export interface BorrowableData {
  currency: Currency;
  supply: string;
  borrowed: string;
  supplyAPY: string;
  borrowAPY: string;
}

/**
 * Data about a given lending pool.
 */
export type LendingPoolData = {
  pair: UniswapPairs,
  tokenA: BorrowableData,
  tokenB: BorrowableData
}

/**
 * Computes the borrowable data for the given uniswap pair.
 * @param lendingPoolContractData 
 * @param uniswapPair 
 */
const computeRowData = async (
  lendingPoolContractData: LendingPoolContractData,
  uniswapPair: UniswapPairs
) => {
  const pairData = UniswapPairData[uniswapPair];
  const data = await Promise.all([
    lendingPoolContractData.borrowable0.methods.getAPY().call(),
    lendingPoolContractData.borrowable1.methods.getAPY().call(),
  ]);
  return {
    pair: uniswapPair,
    tokenA: {
      currency: pairData.currency1,
      borrowAPY: data[0]
    },
    tokenB: {
      currency: pairData.currency1,
      borrowAPY: data[1]
    }
  } as LendingPoolData;
}

export default function useLendingPoolTableData() {

  const contracts = useContracts();
  const [lendingPoolData, setLendingPoolData] = useState<LendingPoolData[]>([]);

  useEffect(() => {
    if (!contracts) return;
    
    const run = async () => {
      const data = await Promise.all(
        values(
          mapObjIndexed(computeRowData)(contracts[ContractInstances.LendingPoolContracts])
        )
      );
      setLendingPoolData(data);
    }
    
    run();
    
  }, [contracts]);

  return lendingPoolData;

}