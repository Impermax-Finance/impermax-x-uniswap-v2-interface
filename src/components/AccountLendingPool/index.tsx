import React, { useContext, useState, useEffect } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useWallet } from 'use-wallet';
import Button from 'react-bootstrap/Button';
import './index.scss';
import { useRouterAccount } from '../../hooks/useImpermaxRouter';
import { PoolTokenType } from '../../impermax-router/interfaces';
import AccountLendingPoolDetails from './AccountLendingPoolDetailsLeverage';
import AccountLendingPoolLPRow from './AccountLendingPoolLPRow';
import AccountLendingPoolRow from './AccountLendingPoolBorrowRow';
import PairAddressContext from '../../contexts/PairAddress';
import PoolTokenContext from '../../contexts/PoolToken';
import AccountLendingPoolPageSelector from './AccountLendingPoolPageSelector';
import AccountLendingPoolSupplyRow from './AccountLendingPoolSupplyRow';
import AccountLendingPoolBorrowRow from './AccountLendingPoolBorrowRow';
import AccountLendingPoolDetailsLeverage from './AccountLendingPoolDetailsLeverage';
import AccountLendingPoolDetailsEarnInterest from './AccountLendingPoolDetailsEarnInterest';
import { useDepositedUSD, useSuppliedUSD } from '../../hooks/useData';

export enum AccountLendingPoolPage {
  UNINITIALIZED,
  LEVERAGE,
  EARN_INTEREST,
}

interface AccountLendingPoolContainerProps {
  children: any;
}

function AccountLendingPoolContainer({ children }: AccountLendingPoolContainerProps) {
  return (<div className="account-lending-pool">
    <Card>
      <Card.Body>
        { children }
      </Card.Body>
    </Card>
  </div>);
}

/**
 * Generate the Account Lending Pool card, giving details about the particular user's equity in the pool.
 * @params AccountLendingPoolProps
 */
export default function AccountLendingPool() {
  const { connect, account } = useWallet();
  const routerAccount = useRouterAccount();

  const collateralUSD = useDepositedUSD(PoolTokenType.Collateral);
  const suppliedUSD = useSuppliedUSD();
  const [pageSelected, setPageSelected] = useState<AccountLendingPoolPage>(AccountLendingPoolPage.UNINITIALIZED);
  const actualPageSelected = pageSelected === AccountLendingPoolPage.UNINITIALIZED 
    ? collateralUSD > 0 || suppliedUSD === 0 
      ? AccountLendingPoolPage.LEVERAGE
      : AccountLendingPoolPage.EARN_INTEREST
    : pageSelected;

  if (!account || !routerAccount) return (
    <AccountLendingPoolContainer>
      <div className="text-center py-5">
        <Button onClick={() => {connect('injected')}} className="button-green">Connect to use the App</Button>
      </div>
    </AccountLendingPoolContainer>
  );
    
  return (
    <AccountLendingPoolContainer>
      <AccountLendingPoolPageSelector pageSelected={actualPageSelected} setPageSelected={setPageSelected} />
      { actualPageSelected === AccountLendingPoolPage.LEVERAGE ? (<>
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
      </>) : (<>
        <AccountLendingPoolDetailsEarnInterest />
        <PoolTokenContext.Provider value={PoolTokenType.BorrowableA}>
          <AccountLendingPoolSupplyRow />
        </PoolTokenContext.Provider>
        <PoolTokenContext.Provider value={PoolTokenType.BorrowableB}>
          <AccountLendingPoolSupplyRow />
        </PoolTokenContext.Provider>
      </>) }
    </AccountLendingPoolContainer>
  );
}