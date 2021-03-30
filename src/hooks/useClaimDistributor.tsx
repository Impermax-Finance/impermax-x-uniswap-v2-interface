import { BigNumber, ethers } from 'ethers';
import { useCallback, useMemo, useState } from 'react';
import { useTransactionAdder } from '../state/transactions/hooks';
import useImpermaxRouter, { useRouterCallback, useDoUpdate } from './useImpermaxRouter';
import { ButtonState } from '../components/InteractionButton';
import { useSymbol, useAvailableClaimable } from './useData';
import { formatAmount } from '../utils/format';
import usePairAddress from './usePairAddress';
import { PoolTokenType } from '../impermax-router/interfaces';
import { DistributorDetails } from '../utils/constants';


export default function useClaimDistributor(distributor: DistributorDetails): [ButtonState, () => Promise<void>] {
  const availableClaimable = useAvailableClaimable(distributor.claimableAddress);
  const impermaxRouter = useImpermaxRouter();
  const doUpdate = useDoUpdate();
  const addTransaction = useTransactionAdder();
  const [pending, setPending] = useState<boolean>(false);

  const summary = `Claim ${ formatAmount(availableClaimable) } IMX from ${distributor.name}`;
  
  const claimDistributorState: ButtonState = useMemo(() => {
    if (pending) return ButtonState.Pending;
    return ButtonState.Ready;
  }, [pending]);

  const claimDistributor = useCallback(async (): Promise<void> => {
    if (claimDistributorState !== ButtonState.Ready) return;
    setPending(true);
    try {
      await impermaxRouter.claimDistributor(distributor, (hash: string) => {
        addTransaction({ hash }, { summary });
      });
      doUpdate();
    }
    finally {
      setPending(false);
    }
  }, [distributor, summary, addTransaction]);

  return [claimDistributorState, claimDistributor];
}