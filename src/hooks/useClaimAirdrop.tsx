// ray test touch <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// ray test touch >

import { useCallback, useMemo, useState } from 'react';
import { useTransactionAdder } from '../state/transactions/hooks';
import useImpermaxRouter, { useDoUpdate } from './useImpermaxRouter';
import { ButtonState } from '../components/InteractionButton';
import { useAirdropData } from './useData';
import { formatAmount } from '../utils/format';

export default function useClaimAirdrop(): [ButtonState, () => Promise<void>] {
  const airdropData = useAirdropData();
  const impermaxRouter = useImpermaxRouter();
  const doUpdate = useDoUpdate();
  const addTransaction = useTransactionAdder();
  const [pending, setPending] = useState<boolean>(false);

  const summary = airdropData && airdropData.amount && `Claim ${formatAmount(parseFloat(airdropData.amount.toString()) / 1e18)} IMX`;

  const claimAirdropState: ButtonState = useMemo(() => {
    if (pending) return ButtonState.Pending;
    return ButtonState.Ready;
  }, [pending]);

  const claimAirdrop = useCallback(async (): Promise<void> => {
    if (claimAirdropState !== ButtonState.Ready) return;
    setPending(true);
    try {
      await impermaxRouter.claimAirdrop(airdropData, (hash: string) => {
        addTransaction({ hash }, { summary });
      });
      doUpdate();
    } finally {
      setPending(false);
    }
  }, [airdropData, addTransaction]);

  return [claimAirdropState, claimAirdrop];
}
