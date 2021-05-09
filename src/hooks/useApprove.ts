// ray test touch <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// ray test touch >

import { BigNumber, ethers } from 'ethers';
import { useCallback, useMemo, useState } from 'react';
import { useTransactionAdder } from '../state/transactions/hooks';
import useAllowance from './useAllowance';
import { ApprovalType, PoolTokenType } from '../impermax-router/interfaces';
import usePairAddress from './usePairAddress';
import usePoolToken from './usePoolToken';
import useImpermaxRouter from './useImpermaxRouter';
import { ButtonState } from '../components/InteractionButton';
import { useSymbol } from './useData';

const ZERO = ethers.constants.Zero;
const APPROVE_AMOUNT = ethers.constants.MaxUint256;

export interface PermitData {
  permitData: string;
  amount: BigNumber;
  deadline: BigNumber;
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export default function useApprove(approvalType: ApprovalType, amount: BigNumber, invalidInput: boolean, poolTokenTypeArg?: PoolTokenType, deadline?: BigNumber): [ButtonState, () => Promise<void>, PermitData] {
  const uniswapV2PairAddress = usePairAddress();
  // ray test touch <
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const poolTokenType = poolTokenTypeArg ? poolTokenTypeArg : usePoolToken();
  // ray test touch >
  const impermaxRouter = useImpermaxRouter();
  const addTransaction = useTransactionAdder();
  const [pending, setPending] = useState<boolean>(false);
  const [permitData, setPermitData] = useState<PermitData>(null);
  const currentAllowance = useAllowance(approvalType, pending, poolTokenType);

  const symbol = useSymbol();
  const action = approvalType === ApprovalType.BORROW ? 'borrow' : approvalType === ApprovalType.POOL_TOKEN ? 'withdrawal' : 'transfer';
  const summary = `Approve ${symbol} ${action}`;

  const approvalState: ButtonState = useMemo(() => {
    if (invalidInput) return ButtonState.Disabled;
    if (!currentAllowance) return ButtonState.Disabled;
    if (amount.eq(ZERO)) return ButtonState.Disabled;
    return currentAllowance.lt(amount) && (permitData === null || !permitData.amount.eq(amount)) ?
      pending ?
        ButtonState.Pending :
        ButtonState.Ready :
      ButtonState.Done;
  }, [currentAllowance, pending, amount]);

  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ButtonState.Ready) return;
    setPending(true);
    impermaxRouter.getPermitData(uniswapV2PairAddress, poolTokenType, approvalType, amount, deadline, async (permitData: PermitData) => {
      if (permitData) setPermitData(permitData);
      else {
        // Fallback to traditional approve if can't sign
        setPermitData(null);
        try {
          await impermaxRouter.approve(uniswapV2PairAddress, poolTokenType, approvalType, APPROVE_AMOUNT, (hash: string) => {
            addTransaction({ hash }, { summary });
          });
        } catch (err) {
          console.error(err);
        }
      }
      setPending(false);
    });
  }, [approvalState, uniswapV2PairAddress, poolTokenType, addTransaction, amount, deadline]);

  return [approvalState, approve, permitData];
}
