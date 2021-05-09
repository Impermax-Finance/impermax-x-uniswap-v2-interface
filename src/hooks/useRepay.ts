// ray test touch <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// ray test touch >

import { BigNumber } from 'ethers';
import { useCallback, useMemo, useState } from 'react';
import { useTransactionAdder } from '../state/transactions/hooks';
import usePairAddress from './usePairAddress';
import usePoolToken from './usePoolToken';
import useImpermaxRouter, { useDoUpdate } from './useImpermaxRouter';
import { ButtonState } from '../components/InteractionButton';
import { useSymbol, usefromTokens } from './useData';
import { formatFloat } from '../utils/format';

export default function useRepay(approvalState: ButtonState, amount: BigNumber, invalidInput: boolean): [ButtonState, () => Promise<void>] {
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
    if (invalidInput) return ButtonState.Disabled;
    // eslint-disable-next-line eqeqeq
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
    } finally {
      setPending(false);
    }
  }, [approvalState, uniswapV2PairAddress, poolTokenType, addTransaction, amount]);

  return [repayState, repay];
}
