import { BigNumber, ethers } from 'ethers';
import { useCallback, useMemo, useState } from 'react';
import { useTransactionAdder } from '../state/transactions/hooks';
import useAllowance from './useAllowance';
import { ApprovalType } from '../impermax-router/interfaces';
import usePairAddress from './usePairAddress';
import usePoolToken from './usePoolToken';
import useImpermaxRouter, { useRouterCallback } from './useImpermaxRouter';
import { ButtonState } from '../components/InteractionButton';

const ZERO = ethers.constants.Zero;
const APPROVE_AMOUNT = ethers.constants.MaxUint256;

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export default function useApprove(approvalType: ApprovalType, amount: BigNumber): [ButtonState, () => Promise<void>] {
  const uniswapV2PairAddress = usePairAddress();
  const poolTokenType = usePoolToken();
  const impermaxRouter = useImpermaxRouter();
  const addTransaction = useTransactionAdder();
  const [pending, setPending] = useState<boolean>(false);
  const currentAllowance = useAllowance(approvalType, pending);

  const approvalState: ButtonState = useMemo(() => {
    if (!currentAllowance) return ButtonState.Disabled;
    if (amount.eq(ZERO)) return ButtonState.Disabled
    return currentAllowance.lt(amount)
      ? pending
        ? ButtonState.Pending
        : ButtonState.Ready
      : ButtonState.Done;
  }, [currentAllowance, pending, amount]);

  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ButtonState.Ready) return;
    setPending(true);
    impermaxRouter.getPermitData(uniswapV2PairAddress, poolTokenType, approvalType, APPROVE_AMOUNT, (permitData: string) => {
      setPending(false);
      if (!permitData) return;
      console.log("ho ottenuto: ", permitData);
    });
    //const response = await impermaxRouter.approve(uniswapV2PairAddress, poolTokenType, approvalType, APPROVE_AMOUNT);
    //addTransaction(response, await impermaxRouter.getApprovalInfo(uniswapV2PairAddress, poolTokenType, approvalType));
  }, [approvalState, uniswapV2PairAddress, poolTokenType, addTransaction, amount]);

  return [approvalState, approve];
}