// ray test touch <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// ray test touch >

import { BigNumber } from 'ethers';
import { useCallback, useMemo, useState } from 'react';
import { useTransactionAdder } from '../state/transactions/hooks';
import usePairAddress from './usePairAddress';
import useImpermaxRouter, { useDoUpdate } from './useImpermaxRouter';
import { ButtonState } from '../components/InteractionButton';
import { PermitData } from './useApprove';
import { PoolTokenType } from '../impermax-router/interfaces';
import { useToNumber, useSymbol } from './useData';
import { formatFloat } from '../utils/format';

export default function useLeverage(
  approvalStateA: ButtonState,
  approvalStateB: ButtonState,
  invalidInput: boolean,
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

  const valA = useToNumber(amountA, PoolTokenType.BorrowableA);
  const valB = useToNumber(amountB, PoolTokenType.BorrowableB);
  const symbol = useSymbol();
  const symbolA = useSymbol(PoolTokenType.BorrowableA);
  const symbolB = useSymbol(PoolTokenType.BorrowableB);
  const summary = `Leverage ${symbol}: borrow ${formatFloat(valA)} ${symbolA} and  ${formatFloat(valB)} ${symbolB}`;

  const leverageState: ButtonState = useMemo(() => {
    if (invalidInput) return ButtonState.Disabled;
    // eslint-disable-next-line eqeqeq
    if (approvalStateA != ButtonState.Done || approvalStateB != ButtonState.Done) return ButtonState.Disabled;
    if (pending) return ButtonState.Pending;
    return ButtonState.Ready;
  }, [approvalStateA, approvalStateB, pending]);

  const leverage = useCallback(async (): Promise<void> => {
    if (leverageState !== ButtonState.Ready) return;
    setPending(true);
    try {
      await impermaxRouter.leverage(uniswapV2PairAddress, amountA, amountB, amountAMin, amountBMin, permitDataA, permitDataB, (hash: string) => {
        addTransaction({ hash }, { summary });
      });
      doUpdate();
    } finally {
      setPending(false);
    }
  }, [uniswapV2PairAddress, addTransaction, amountA, amountB, amountAMin, amountBMin, permitDataA, permitDataB]);

  return [leverageState, leverage];
}
