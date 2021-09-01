
import * as React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useParams } from 'react-router-dom';
import {
  useErrorHandler,
  withErrorBoundary
} from 'react-error-boundary';

import AccountLendingPoolPageSelector from './AccountLendingPoolPageSelector';
import AccountLendingPoolLPRow from './AccountLendingPoolLPRow';
import AccountLendingPoolBorrowRow from './AccountLendingPoolBorrowRow';
import AccountLendingPoolSupplyRow from './AccountLendingPoolSupplyRow';
import AccountLendingPoolDetailsLeverage from './AccountLendingPoolDetailsLeverage';
import AccountLendingPoolDetailsEarnInterest from './AccountLendingPoolDetailsEarnInterest';
import AccountLendingPoolFarming from './AccountLendingPoolFarming';
import Panel from 'components/Panel';
import ErrorFallback from 'components/ErrorFallback';
import ImpermaxJadeContainedButton from 'components/buttons/ImpermaxJadeContainedButton';
import PoolTokenContext from 'contexts/PoolToken';
import { injected } from 'utils/helpers/web3/connectors';
import { PARAMETERS } from 'utils/constants/links';
import { getLendingPoolTokenPriceInUSD } from 'utils/helpers/lending-pools';
import useLendingPool from 'services/hooks/use-lending-pool';
import useTokenDeposited from 'services/hooks/use-token-deposited';
import { PoolTokenType } from 'types/interfaces';
import './index.scss';

interface AccountLendingPoolContainerProps {
  children: React.ReactNode;
}

const AccountLendingPoolContainer = ({ children }: AccountLendingPoolContainerProps) => {
  return (
    <Panel className='bg-white'>
      {children}
    </Panel>
  );
};

/**
 * Generate the Account Lending Pool card, giving details about the particular user's equity in the pool.
 * @params AccountLendingPoolProps
 */

const AccountLendingPool = (): JSX.Element => {
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
    account,
    activate
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

  const [pageSelected, setPageSelected] = React.useState<AccountLendingPoolPage>(AccountLendingPoolPage.Uninitialized);

  const {
    isLoading: collateralDepositedLoading,
    data: collateralDeposited,
    error: collateralDepositedError
  } = useTokenDeposited(
    selectedUniswapV2PairAddress,
    PoolTokenType.Collateral,
    selectedChainID,
    library,
    account
  );
  useErrorHandler(collateralDepositedError);

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
  if (collateralDepositedLoading) {
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
  if (collateralDeposited === undefined) {
    throw new Error('Something went wrong!');
  }

  const tokenAPriceInUSD = getLendingPoolTokenPriceInUSD(selectedLendingPool, PoolTokenType.BorrowableA);
  const tokenBPriceInUSD = getLendingPoolTokenPriceInUSD(selectedLendingPool, PoolTokenType.BorrowableB);
  const collateralPriceInUSD = getLendingPoolTokenPriceInUSD(selectedLendingPool, PoolTokenType.Collateral);
  const tokenADepositedInUSD = tokenADeposited * tokenAPriceInUSD;
  const tokenBDepositedInUSD = tokenBDeposited * tokenBPriceInUSD;
  const collateralDepositedInUSD = collateralDeposited * collateralPriceInUSD;
  const supplyBalanceInUSD = tokenADepositedInUSD + tokenBDepositedInUSD;

  if (!account) {
    return (
      <AccountLendingPoolContainer>
        <div className='text-center py-5'>
          <ImpermaxJadeContainedButton
            onClick={() => {
              // TODO: should handle properly
              activate(injected);
            }}
            className='button-green'>
            Connect to use the App
          </ImpermaxJadeContainedButton>
        </div>
      </AccountLendingPoolContainer>
    );
  }

  const actualPageSelected =
    pageSelected === AccountLendingPoolPage.Uninitialized ?
      collateralDepositedInUSD > 0 || supplyBalanceInUSD === 0 ?
        AccountLendingPoolPage.Leverage :
        AccountLendingPoolPage.EarnInterest :
      pageSelected;

  return (
    <AccountLendingPoolContainer>
      <AccountLendingPoolPageSelector
        pageSelected={actualPageSelected}
        setPageSelected={setPageSelected} />
      {actualPageSelected === AccountLendingPoolPage.Leverage && (
        <>
          <AccountLendingPoolDetailsLeverage />
          <PoolTokenContext.Provider value={PoolTokenType.Collateral}>
            <AccountLendingPoolLPRow />
          </PoolTokenContext.Provider>
          <PoolTokenContext.Provider value={PoolTokenType.BorrowableA}>
            <AccountLendingPoolBorrowRow />
          </PoolTokenContext.Provider>
          <PoolTokenContext.Provider value={PoolTokenType.BorrowableB}>
            <AccountLendingPoolBorrowRow />
          </PoolTokenContext.Provider>
        </>
      )}
      {actualPageSelected === AccountLendingPoolPage.EarnInterest && (
        <>
          <AccountLendingPoolDetailsEarnInterest supplyBalanceInUSD={supplyBalanceInUSD} />
          <PoolTokenContext.Provider value={PoolTokenType.BorrowableA}>
            <AccountLendingPoolSupplyRow />
          </PoolTokenContext.Provider>
          <PoolTokenContext.Provider value={PoolTokenType.BorrowableB}>
            <AccountLendingPoolSupplyRow />
          </PoolTokenContext.Provider>
        </>
      )}
      {actualPageSelected === AccountLendingPoolPage.Farming && (
        <>
          <AccountLendingPoolFarming />
        </>
      )}
    </AccountLendingPoolContainer>
  );
};

export enum AccountLendingPoolPage {
  Uninitialized,
  Leverage,
  EarnInterest,
  Farming
}

export default withErrorBoundary(AccountLendingPool, {
  FallbackComponent: ErrorFallback,
  onReset: () => {
    window.location.reload();
  }
});
