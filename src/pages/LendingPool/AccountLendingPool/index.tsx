
import * as React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import Button from 'react-bootstrap/Button';

import AccountLendingPoolPageSelector from './AccountLendingPoolPageSelector';
import AccountLendingPoolLPRow from './AccountLendingPoolLPRow';
import AccountLendingPoolBorrowRow from './AccountLendingPoolBorrowRow';
import AccountLendingPoolSupplyRow from './AccountLendingPoolSupplyRow';
import AccountLendingPoolDetailsLeverage from './AccountLendingPoolDetailsLeverage';
import AccountLendingPoolDetailsEarnInterest from './AccountLendingPoolDetailsEarnInterest';
import AccountLendingPoolFarming from './AccountLendingPoolFarming';
import Panel from 'components/Panel';
import PoolTokenContext from 'contexts/PoolToken';
import { useDepositedUSD, useSuppliedUSD } from 'hooks/useData';
import { injected } from 'utils/helpers/web3/connectors';
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
    activate,
    account
  } = useWeb3React<Web3Provider>();

  const collateralUSD = useDepositedUSD(PoolTokenType.Collateral);
  const suppliedUSD = useSuppliedUSD();
  const [pageSelected, setPageSelected] = React.useState<AccountLendingPoolPage>(AccountLendingPoolPage.Uninitialized);
  const actualPageSelected = pageSelected === AccountLendingPoolPage.Uninitialized ?
    collateralUSD > 0 || suppliedUSD === 0 ?
      AccountLendingPoolPage.Leverage :
      AccountLendingPoolPage.EarnInterest :
    pageSelected;

  if (!account) {
    return (
      <AccountLendingPoolContainer>
        <div className='text-center py-5'>
          <Button
            onClick={() => {
              // TODO: should handle properly
              activate(injected);
            }}
            className='button-green'>
            Connect to use the App
          </Button>
        </div>
      </AccountLendingPoolContainer>
    );
  }

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
          <AccountLendingPoolDetailsEarnInterest />
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

export default AccountLendingPool;
