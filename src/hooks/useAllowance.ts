// ray test touch <
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// ray test touch >

import { useState } from 'react';
import { BigNumber } from 'ethers';
import { ApprovalType, PoolTokenType } from '../impermax-router/interfaces';
import usePairAddress from './usePairAddress';
import usePoolToken from './usePoolToken';
import { useRouterCallback } from './useImpermaxRouter';

export default function useAllowance(approvalType: ApprovalType, pendingApproval?: boolean, poolTokenTypeArg?: PoolTokenType) {
  const uniswapV2PairAddress = usePairAddress();
  // ray test touch <
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const poolTokenType = poolTokenTypeArg ? poolTokenTypeArg : usePoolToken();
  // ray test touch >

  const [allowance, setAllowance] = useState<BigNumber>(null);
  useRouterCallback(async router => {
    router.getAllowance(uniswapV2PairAddress, poolTokenType, approvalType).then(data => setAllowance(data));
  }, [pendingApproval]);

  return allowance;
}
