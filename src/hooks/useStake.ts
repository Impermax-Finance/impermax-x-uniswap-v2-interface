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

export default function useStake(approvalState: ButtonState, amount: BigNumber, invalidInput: boolean): [ButtonState, () => Promise<void>] {
  const impermaxRouter = useImpermaxRouter();
  const doUpdate = useDoUpdate();
  const addTransaction = useTransactionAdder();
  const [pending, setPending] = useState<boolean>(false);

  const val = useToNumber(amount, null, 18);
  const summary = `Stake ${formatFloat(val)} IMX`;

  const stakeState: ButtonState = useMemo(() => {
    if (invalidInput) return ButtonState.Disabled;
    if (approvalState !== ButtonState.Done) return ButtonState.Disabled;
    if (pending) return ButtonState.Pending;
    return ButtonState.Ready;
  }, [approvalState, pending, amount]);

  const stake = useCallback(async (): Promise<void> => {
    if (stakeState !== ButtonState.Ready) return;
    setPending(true);
    try {
      await impermaxRouter.stake(amount, (hash: string) => {
        addTransaction({ hash }, { summary });
      });
      doUpdate();
    } finally {
      setPending(false);
    }
  }, [approvalState, addTransaction, amount]);

  return [stakeState, stake];
}
// ray test touch >>
