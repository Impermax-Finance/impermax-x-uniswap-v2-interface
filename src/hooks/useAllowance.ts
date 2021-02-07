import { useCallback, useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import { BigNumber } from 'ethers';
import { ERC20, ApprovalType } from '../impermax-router/interfaces';
import usePairAddress from './usePairAddress';
import usePoolToken from './usePoolToken';
import { useRouterCallback } from './useImpermaxRouter';

export default function useAllowance(approvalType: ApprovalType, pendingApproval?: boolean) {
  const uniswapV2PairAddress = usePairAddress();
  const poolTokenType = usePoolToken();
  
  const [allowance, setAllowance] = useState<BigNumber>(null);
  useRouterCallback(async (router) => {
    router.getAllowance(uniswapV2PairAddress, poolTokenType, approvalType).then((data) => setAllowance(data));
  }, [pendingApproval]);

  return allowance;
};