// ray test touch <<
// TODO: <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// TODO: >

import { BigNumber } from '@ethersproject/bignumber';
import { useCallback, useMemo, useState } from 'react';
import { useTransactionAdder } from 'store/transactions/hooks';
import useImpermaxRouter, { useDoUpdate } from './useImpermaxRouter';
import { ButtonState } from '../components/InteractionButton';
import { useToNumber } from './useData';
import { formatFloat } from '../utils/format';

export default function useUnstake(approvalState: ButtonState, token: BigNumber, invalidInput: boolean): [ButtonState, () => Promise<void>] {
  const impermaxRouter = useImpermaxRouter();
  const doUpdate = useDoUpdate();
  const addTransaction = useTransactionAdder();
  const [pending, setPending] = useState<boolean>(false);

  const val = useToNumber(token, null, 18);
  const summary = `Unstake ${formatFloat(val)} IMX`;

  const unstakeState: ButtonState = useMemo(() => {
    if (invalidInput) return ButtonState.Disabled;
    if (approvalState !== ButtonState.Done) return ButtonState.Disabled;
    if (pending) return ButtonState.Pending;
    return ButtonState.Ready;
  }, [approvalState, pending, token]);

  const unstake = useCallback(async (): Promise<void> => {
    if (unstakeState !== ButtonState.Ready) return;
    setPending(true);
    try {
      await impermaxRouter.unstake(token, (hash: string) => {
        addTransaction({ hash }, { summary });
      });
      doUpdate();
    } finally {
      setPending(false);
    }
  }, [approvalState, addTransaction, token]);

  return [unstakeState, unstake];
}
// ray test touch >>
