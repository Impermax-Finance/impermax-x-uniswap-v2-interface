import { BigNumber, ethers } from 'ethers';
import { useCallback, useMemo, useState } from 'react';
import { useTransactionAdder } from '../state/transactions/hooks';
import useAllowance from './useAllowance';
import usePairAddress from './usePairAddress';
import usePoolToken from './usePoolToken';
import useImpermaxRouter, { useRouterCallback, useDoUpdate } from './useImpermaxRouter';
import { ButtonState } from '../components/InteractionButton';
import { PermitData } from './useApprove';


export default function useRepay(approvalState: ButtonState, amount: BigNumber): [ButtonState, () => Promise<void>] {
  const uniswapV2PairAddress = usePairAddress();
  const poolTokenType = usePoolToken();
  const impermaxRouter = useImpermaxRouter();
  const doUpdate = useDoUpdate();
  const addTransaction = useTransactionAdder();
  const [pending, setPending] = useState<boolean>(false);
  
  const repayState: ButtonState = useMemo(() => {
    if (approvalState != ButtonState.Done) return ButtonState.Disabled;
    if (pending) return ButtonState.Pending;
    return ButtonState.Ready;
  }, [approvalState, pending, amount]);

  const repay = useCallback(async (): Promise<void> => {
    if (repayState !== ButtonState.Ready) return;
    setPending(true);
    try {
      const response = await impermaxRouter.repay(uniswapV2PairAddress, poolTokenType, amount);
      const symbol = await impermaxRouter.getSymbol(uniswapV2PairAddress, poolTokenType);
      addTransaction(response, { summary: `Repay ${symbol}` });
      doUpdate();
    }
    finally {
      setPending(false);
    }
  }, [approvalState, uniswapV2PairAddress, poolTokenType, addTransaction, amount]);

  return [repayState, repay];
}