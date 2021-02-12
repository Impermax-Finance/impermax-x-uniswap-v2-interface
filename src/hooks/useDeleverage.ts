import { BigNumber, ethers } from 'ethers';
import { useCallback, useMemo, useState } from 'react';
import { useTransactionAdder } from '../state/transactions/hooks';
import useAllowance from './useAllowance';
import usePairAddress from './usePairAddress';
import usePoolToken from './usePoolToken';
import useImpermaxRouter, { useRouterCallback, useDoUpdate } from './useImpermaxRouter';
import { ButtonState } from '../components/InteractionButton';
import { PermitData } from './useApprove';
import { PoolTokenType } from '../impermax-router/interfaces';
import { useToNumber, useSymbol } from './useData';
import { formatFloat } from '../utils/format';


export default function useDeleverage(
  approvalState: ButtonState,
  tokens: BigNumber,
  amountAMin: BigNumber, 
  amountBMin: BigNumber,
  permitData: PermitData
): [ButtonState, () => Promise<void>] {
  const uniswapV2PairAddress = usePairAddress();
  const impermaxRouter = useImpermaxRouter();
  const doUpdate = useDoUpdate();
  const addTransaction = useTransactionAdder();
  const [pending, setPending] = useState<boolean>(false);

  const val = useToNumber(tokens);
  const symbol = useSymbol();
  const summary = `Deleverage ${symbol}: withdraw ${formatFloat(val)} ${symbol}`;
  
  const deleverageState: ButtonState = useMemo(() => {
    if (approvalState != ButtonState.Done) return ButtonState.Disabled;
    if (pending) return ButtonState.Pending;
    return ButtonState.Ready;
  }, [approvalState, pending]);

  const deleverage = useCallback(async (): Promise<void> => {
    if (deleverageState !== ButtonState.Ready) return;
    setPending(true);
    try {
      await impermaxRouter.deleverage(uniswapV2PairAddress, tokens, amountAMin, amountBMin, permitData, (hash: string) => {
        addTransaction({ hash }, { summary });
      });
      doUpdate();
    }
    finally {
      setPending(false);
    }
  }, [uniswapV2PairAddress, addTransaction, tokens, amountAMin, amountBMin, permitData]);

  return [deleverageState, deleverage];
}