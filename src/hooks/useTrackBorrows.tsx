import { BigNumber, ethers } from 'ethers';
import { useCallback, useMemo, useState } from 'react';
import { useTransactionAdder } from '../state/transactions/hooks';
import useImpermaxRouter, { useRouterCallback, useDoUpdate } from './useImpermaxRouter';
import { ButtonState } from '../components/InteractionButton';
import { useSymbol } from './useData';
import { formatAmount } from '../utils/format';
import usePairAddress from './usePairAddress';
import { PoolTokenType } from '../impermax-router/interfaces';


export default function useTrackBorrows(): [ButtonState, () => Promise<void>] {
  const uniswapV2PairAddress = usePairAddress();
  const symbol = useSymbol(PoolTokenType.Collateral);
  const impermaxRouter = useImpermaxRouter();
  const doUpdate = useDoUpdate();
  const addTransaction = useTransactionAdder();
  const [pending, setPending] = useState<boolean>(false);

  const summary = `Enabled IMX reward for ${symbol}`;
  
  const trackBorrowsState: ButtonState = useMemo(() => {
    if (pending) return ButtonState.Pending;
    return ButtonState.Ready;
  }, [pending]);

  const trackBorrows = useCallback(async (): Promise<void> => {
    if (trackBorrowsState !== ButtonState.Ready) return;
    setPending(true);
    try {
      await impermaxRouter.trackBorrows(uniswapV2PairAddress, (hash: string) => {
        addTransaction({ hash }, { summary });
      });
      doUpdate();
    }
    finally {
      setPending(false);
    }
  }, [uniswapV2PairAddress, summary, addTransaction]);

  return [trackBorrowsState, trackBorrows];
}