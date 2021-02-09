import { BigNumber, ethers } from 'ethers';
import { useCallback, useMemo, useState } from 'react';
import { useTransactionAdder } from '../state/transactions/hooks';
import useAllowance from './useAllowance';
import usePairAddress from './usePairAddress';
import usePoolToken from './usePoolToken';
import useImpermaxRouter, { useRouterCallback, useDoUpdate } from './useImpermaxRouter';
import { ButtonState } from '../components/InteractionButton';
import { PermitData } from './useApprove';


export default function useWithdraw(approvalState: ButtonState, tokens: BigNumber, permitData: PermitData): [ButtonState, () => Promise<void>] {
  const uniswapV2PairAddress = usePairAddress();
  const poolTokenType = usePoolToken();
  const impermaxRouter = useImpermaxRouter();
  const doUpdate = useDoUpdate();
  const addTransaction = useTransactionAdder();
  const [pending, setPending] = useState<boolean>(false);
  
  const withdrawState: ButtonState = useMemo(() => {
    if (approvalState != ButtonState.Done) return ButtonState.Disabled;
    if (pending) return ButtonState.Pending;
    return ButtonState.Ready;
  }, [approvalState, pending]);

  const withdraw = useCallback(async (): Promise<void> => {
    if (withdrawState !== ButtonState.Ready) return;
    setPending(true);
    try {
      const response = await impermaxRouter.withdraw(uniswapV2PairAddress, poolTokenType, tokens, permitData);
      const symbol = await impermaxRouter.getSymbol(uniswapV2PairAddress, poolTokenType);
      addTransaction(response, { summary: `Withdraw ${symbol}` });
      doUpdate();
    }
    finally {
      setPending(false);
    }
  }, [approvalState, uniswapV2PairAddress, poolTokenType, addTransaction, tokens, permitData]);

  return [withdrawState, withdraw];
}