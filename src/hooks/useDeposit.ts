import { BigNumber, ethers } from 'ethers';
import { useCallback, useMemo, useState } from 'react';
import { useTransactionAdder } from '../state/transactions/hooks';
import useAllowance from './useAllowance';
import usePairAddress from './usePairAddress';
import usePoolToken from './usePoolToken';
import useImpermaxRouter, { useRouterCallback, useDoUpdate } from './useImpermaxRouter';
import { ButtonState } from '../components/InteractionButton';
import { PermitData } from './useApprove';

// TODO this should manage deposit error, for example insufficient balance

export default function useDeposit(approvalState: ButtonState, amount: BigNumber, permitData: PermitData): [ButtonState, () => Promise<void>] {
  const uniswapV2PairAddress = usePairAddress();
  const poolTokenType = usePoolToken();
  const impermaxRouter = useImpermaxRouter();
  const doUpdate = useDoUpdate();
  const addTransaction = useTransactionAdder();
  const [pending, setPending] = useState<boolean>(false);
  
  const depositState: ButtonState = useMemo(() => {
    if (approvalState != ButtonState.Done) return ButtonState.Disabled;
    if (pending) return ButtonState.Pending;
    return ButtonState.Ready;
  }, [approvalState, pending, amount]);

  const deposit = useCallback(async (): Promise<void> => {
    if (depositState !== ButtonState.Ready) return;
    setPending(true);
    try {
      const response = await impermaxRouter.deposit(uniswapV2PairAddress, poolTokenType, amount, permitData);
      const symbol = await impermaxRouter.getSymbol(uniswapV2PairAddress, poolTokenType);
      addTransaction(response, { summary: `Deposit ${symbol}` });
      doUpdate();
    }
    finally {
      setPending(false);
    }
  }, [approvalState, uniswapV2PairAddress, poolTokenType, addTransaction, amount, permitData]);

  return [depositState, deposit];
}