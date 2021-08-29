
// ray test touch <<<
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useParams } from 'react-router-dom';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';
// ray test touch >>>
import clsx from 'clsx';

import DetailList, { DetailListItem } from 'components/DetailList';
// ray test touch <<<
import ErrorFallback from 'components/ErrorFallback';
// ray test touch >>>
import {
  useSuppliedUSD,
  useAccountAPY
} from 'hooks/useData';
import {
  formatNumberWithUSDCommaDecimals,
  formatNumberWithPercentageCommaDecimals
} from 'utils/helpers/format-number';
// ray test touch <<<
import { PARAMETERS } from 'utils/constants/links';
import { getLendingPoolTokenPriceInUSD } from 'utils/helpers/lending-pools';
import useLendingPool from 'services/hooks/use-lending-pool';
import useTokenDeposited from 'services/hooks/use-token-deposited';
import { PoolTokenType } from 'types/interfaces';
// ray test touch >>>

/**
 * Generates lending pool aggregate details.
 */

const AccountLendingPoolDetailsEarnInterest = (): JSX.Element => {
  // ray test touch <<<
  const {
    [PARAMETERS.CHAIN_ID]: selectedChainIDParam,
    [PARAMETERS.UNISWAP_V2_PAIR_ADDRESS]: selectedUniswapV2PairAddress
  } = useParams<Record<string, string>>();
  const selectedChainID = Number(selectedChainIDParam);

  const {
    isLoading: selectedLendingPoolLoading,
    data: selectedLendingPool,
    error: selectedLendingPoolError
  } = useLendingPool(selectedUniswapV2PairAddress, selectedChainID);
  useErrorHandler(selectedLendingPoolError);

  const {
    library,
    account
  } = useWeb3React<Web3Provider>();

  const {
    isLoading: tokenADepositedLoading,
    data: tokenADeposited,
    error: tokenADepositedError
  } = useTokenDeposited(
    selectedUniswapV2PairAddress,
    PoolTokenType.BorrowableA,
    selectedChainID,
    library,
    account
  );
  useErrorHandler(tokenADepositedError);
  const {
    isLoading: tokenBDepositedLoading,
    data: tokenBDeposited,
    error: tokenBDepositedError
  } = useTokenDeposited(
    selectedUniswapV2PairAddress,
    PoolTokenType.BorrowableB,
    selectedChainID,
    library,
    account
  );
  useErrorHandler(tokenBDepositedError);

  const suppliedUSD = useSuppliedUSD();
  // ray test touch >>>
  // ray test touch <<
  const accountAPY = useAccountAPY();
  // ray test touch >>

  // ray test touch <<<
  // TODO: should use skeleton loaders
  if (selectedLendingPoolLoading) {
    return <>Loading...</>;
  }
  if (tokenADepositedLoading) {
    return <>Loading...</>;
  }
  if (tokenBDepositedLoading) {
    return <>Loading...</>;
  }
  if (tokenADeposited === undefined) {
    throw new Error('Something went wrong!');
  }
  if (tokenBDeposited === undefined) {
    throw new Error('Something went wrong!');
  }
  if (selectedLendingPool === undefined) {
    throw new Error('Something went wrong!');
  }

  const tokenAPriceInUSD = getLendingPoolTokenPriceInUSD(selectedLendingPool, PoolTokenType.BorrowableA);
  const tokenBPriceInUSD = getLendingPoolTokenPriceInUSD(selectedLendingPool, PoolTokenType.BorrowableB);

  console.log('ray : ***** tokenADepositedInUSD => ', tokenADeposited * tokenAPriceInUSD);
  console.log('ray : ***** tokenBDepositedInUSD => ', tokenBDeposited * tokenBPriceInUSD);
  // ray test touch >>>

  return (
    <div
      className={clsx(
        // TODO: componentize
        'space-y-6',
        'md:space-y-0',
        'md:grid',
        'md:grid-cols-2',
        'md:gap-6',
        'px-6',
        'py-6'
      )}>
      <DetailList>
        <DetailListItem title='Supply Balance'>
          {formatNumberWithUSDCommaDecimals(suppliedUSD)}
        </DetailListItem>
      </DetailList>
      <DetailList>
        <DetailListItem title='Net APY'>
          {formatNumberWithPercentageCommaDecimals(accountAPY)}
        </DetailListItem>
      </DetailList>
    </div>
  );
};

// ray test touch <<<
export default withErrorBoundary(AccountLendingPoolDetailsEarnInterest, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
// ray test touch >>>
