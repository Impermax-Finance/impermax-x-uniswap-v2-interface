import { BigNumber, ethers } from 'ethers';
import { useCallback, useMemo, useState } from 'react';
import { useTransactionAdder } from '../state/transactions/hooks';
import useAllowance from './useAllowance';
import usePairAddress from './usePairAddress';
import usePoolToken from './usePoolToken';
import useImpermaxRouter, { useRouterCallback, useDoUpdate } from './useImpermaxRouter';
import { ButtonState } from '../components/InteractionButton';
import { PermitData } from './useApprove';
import { PoolTokenType } from '../impermax-router/interfaces';


export default function useLeverage(
  approvalStateA: ButtonState, 
  approvalStateB: ButtonState, 
  amountA: BigNumber, 
  amountB: BigNumber,
  amountAMin: BigNumber, 
  amountBMin: BigNumber,
  permitDataA: PermitData, 
  permitDataB: PermitData
): [ButtonState, () => Promise<void>] {
  const uniswapV2PairAddress = usePairAddress();
  const impermaxRouter = useImpermaxRouter();
  const doUpdate = useDoUpdate();
  const addTransaction = useTransactionAdder();
  const [pending, setPending] = useState<boolean>(false);
  
  const leverageState: ButtonState = useMemo(() => {
    if (approvalStateA != ButtonState.Done || approvalStateB != ButtonState.Done) return ButtonState.Disabled;
    if (pending) return ButtonState.Pending;
    return ButtonState.Ready;
  }, [approvalStateA, approvalStateB, pending]);

  const leverage = useCallback(async (): Promise<void> => {
    if (leverageState !== ButtonState.Ready) return;
    setPending(true);
    try {
      const response = await impermaxRouter.leverage(uniswapV2PairAddress, amountA, amountB, amountAMin, amountBMin, permitDataA, permitDataB);
      const symbol = await impermaxRouter.getSymbol(uniswapV2PairAddress, PoolTokenType.Collateral);
      addTransaction(response, { summary: `Leverage ${symbol}` });
      doUpdate();
    }
    finally {
      setPending(false);
    }
  }, [uniswapV2PairAddress, addTransaction, amountA, amountB, amountAMin, amountBMin, permitDataA, permitDataB]);

  return [leverageState, leverage];
}