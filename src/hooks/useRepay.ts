import { BigNumber, ethers } from 'ethers';
import { useCallback, useMemo, useState } from 'react';
import { useTransactionAdder } from '../state/transactions/hooks';
import useAllowance from './useAllowance';
import usePairAddress from './usePairAddress';
import usePoolToken from './usePoolToken';
import useImpermaxRouter, { useRouterCallback, useDoUpdate } from './useImpermaxRouter';
import { ButtonState } from '../components/InteractionButton';
import { PermitData } from './useApprove';
import { useToNumber, useSymbol, usefromTokens } from './useData';
import { formatFloat } from '../utils/format';


export default function useRepay(approvalState: ButtonState, amount: BigNumber): [ButtonState, () => Promise<void>] {
  const uniswapV2PairAddress = usePairAddress();
  const poolTokenType = usePoolToken();
  const impermaxRouter = useImpermaxRouter();
  const doUpdate = useDoUpdate();
  const addTransaction = useTransactionAdder();
  const [pending, setPending] = useState<boolean>(false);

  const val = usefromTokens(amount);
  const symbol = useSymbol();
  const summary = `Repay ${formatFloat(val)} ${symbol}`;
  
  const repayState: ButtonState = useMemo(() => {
    if (approvalState != ButtonState.Done) return ButtonState.Disabled;
    if (pending) return ButtonState.Pending;
    return ButtonState.Ready;
  }, [approvalState, pending, amount]);

  const repay = useCallback(async (): Promise<void> => {
    if (repayState !== ButtonState.Ready) return;
    setPending(true);
    try {
      await impermaxRouter.repay(uniswapV2PairAddress, poolTokenType, amount, (hash: string) => {
        addTransaction({ hash }, { summary });
      });
      doUpdate();
    }
    finally {
      setPending(false);
    }
  }, [approvalState, uniswapV2PairAddress, poolTokenType, addTransaction, amount]);

  return [repayState, repay];
}