import { BigNumber, ethers } from 'ethers';
import { useCallback, useMemo, useState } from 'react';
import { useTransactionAdder } from '../state/transactions/hooks';
import useAllowance from './useAllowance';
import usePairAddress from './usePairAddress';
import usePoolToken from './usePoolToken';
import useImpermaxRouter, { useRouterCallback, useDoUpdate } from './useImpermaxRouter';
import { ButtonState } from '../components/InteractionButton';

// TODO this should manage deposit error, for example insufficient balance

// returns a variable indicating the state of the deposit and a function which deposits
export default function useDeposit(approvalState: ButtonState, amount: BigNumber): [ButtonState, () => Promise<void>] {
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
    const response = await impermaxRouter.deposit(uniswapV2PairAddress, poolTokenType, amount);
    setPending(false);
    doUpdate();
    //addTransaction(response, await impermaxRouter.getApprovalInfo(uniswapV2PairAddress, poolTokenType, approvalType));
  }, [approvalState, uniswapV2PairAddress, poolTokenType, addTransaction, amount]);

  return [depositState, deposit];
}