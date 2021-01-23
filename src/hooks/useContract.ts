import { useEffect, useState } from 'react';
import useWeb3 from './useWeb3';
import { Networks } from '../utils/connections';
import { ROUTER } from '../utils/constants';

import ERC20JSON from '../abis/contracts/IERC20.json';
import UniswapV2PairJSON from '../abis/contracts/IUniswapV2Pair.json';
import Router01JSON from '../abis/contracts/IRouter01.json';
import BorrowableJSON from '../abis/contracts/IBorrowable.json';
import CollateralSON from '../abis/contracts/ICollateral.json';
import IFactoryJSON from '../abis/contracts/IFactory.json';

export type Contract = any;
export type ERC20 = Contract;
export type UniswapV2Pair = Contract;
export type Borrowable = Contract;
export type Collateral = Contract;

export type UniswapPairContracts = {
  uniswapV2Pair: UniswapV2Pair,
  tokenA: ERC20,
  tokenB: ERC20
}

export type ImpermaxPairContracts = {
  collateral: Collateral,
  borrowableA: Borrowable,
  borrowableB: Borrowable
}

export type LendingPool = {
  uniswapV2Pair: UniswapV2Pair,
  tokenA: ERC20,
  tokenB: ERC20,
  collateral: Collateral,
  borrowableA: Borrowable,
  borrowableB: Borrowable
}

//TODO network should be chosen by the user, not by an env variable

export function useRouter() {
  const web3 = useWeb3();
  const routerAddress = ROUTER[(process.env.NETWORK as Networks)];
  const [router, setRouter] = useState<Contract|null>();
  useEffect(() => {
    if (!web3) return;
    const contract = new web3.eth.Contract(Router01JSON.abi, routerAddress);
    setRouter(contract);
  }, [web3]);

  return router;
};

export function useFactory() {
  const web3 = useWeb3();
  const router = useRouter();
  const [factory, setFactory] = useState<Contract|null>();
  useEffect(() => {
    if (!router) return;
    router.methods.factory().call().then((address: any) => {
      const contract = new web3.eth.Contract(IFactoryJSON.abi, address);
      setFactory(contract);
    });
  }, [router]);

  return factory;
};

export function useUniswapPairContracts(uniswapV2PairAddress: string) {
  const web3 = useWeb3();
  const [uniswapPairContracts, setUniswapPairContracts] = useState<UniswapPairContracts|null>();
  useEffect(() => {
    if (!web3) return;
    const uniswapV2Pair = new web3.eth.Contract(UniswapV2PairJSON.abi, uniswapV2PairAddress);
    uniswapV2Pair.methods.token0().call().then((token0Address: string) => {
      uniswapV2Pair.methods.token1().call().then((token1Address: string) => {
        setUniswapPairContracts({
          uniswapV2Pair: uniswapV2Pair,
          tokenA: new web3.eth.Contract(ERC20JSON.abi, token0Address),
          tokenB: new web3.eth.Contract(ERC20JSON.abi, token1Address)
        });
      });
    });
  }, [web3]);

  return uniswapPairContracts;
}

export function useImpermaxPairContracts(uniswapV2PairAddress: string) {
  const web3 = useWeb3();
  const router = useRouter();
  const [impermaxPairContracts, setImpermaxPairContracts] = useState<ImpermaxPairContracts|null>();
  useEffect(() => {
    if (!router) return;
    router.methods.getLendingPool(uniswapV2PairAddress).call().then((result: any) => {
      setImpermaxPairContracts({
        collateral: new web3.eth.Contract(CollateralSON.abi, result.collateral),
        borrowableA: new web3.eth.Contract(BorrowableJSON.abi, result.borrowableA),
        borrowableB: new web3.eth.Contract(BorrowableJSON.abi, result.borrowableB)
      });
    });
  }, [router]);

  return impermaxPairContracts;
}

export function useLendingPool(uniswapV2PairAddress: string) {
  const web3 = useWeb3();
  const router = useRouter();
  const uniswapPairContracts = useUniswapPairContracts(uniswapV2PairAddress);
  const impermaxPairContracts = useImpermaxPairContracts(uniswapV2PairAddress);
  const [lendingPool, setLendingPool] = useState<LendingPool|null>();
  useEffect(() => {
    if (!uniswapPairContracts || !impermaxPairContracts) return;
    setLendingPool({
      uniswapV2Pair: uniswapPairContracts.uniswapV2Pair,
      tokenA: uniswapPairContracts.tokenA,
      tokenB: uniswapPairContracts.tokenB,
      collateral: impermaxPairContracts.collateral,
      borrowableA: impermaxPairContracts.borrowableA,
      borrowableB: impermaxPairContracts.borrowableB
    });
  }, [uniswapPairContracts, impermaxPairContracts]);

  return lendingPool;
}