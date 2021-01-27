import React, { useContext, useState, useEffect } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useWallet } from 'use-wallet';
import Button from 'react-bootstrap/Button';
import './index.scss';
import useImpermaxRouter, { useRouterAccount } from '../../hooks/useImpermaxRouter';
import { AccountData, PoolTokenType } from '../../impermax-router/interfaces';
import AccountLendingPoolDetails from './AccountLendingPoolDetails';
import AccountLendingPoolLPRow from './AccountLendingPoolLPRow';
import AccountLendingPoolRow from './AccountLendingPoolRow';
import PairAddressContext from '../../contexts/PairAddress';
import PoolTokenContext from '../../contexts/PoolToken';
import usePairAddress from '../../hooks/usePairAddress';

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

  if (!routerAccount) return (
    <AccountLendingPoolContainer>
      <div className="text-center py-5">
        <Button onClick={() => {connect('injected')}}>Connect to use the App</Button>
      </div>
    </AccountLendingPoolContainer>
  );

  return (
    <AccountLendingPoolContainer>
      <AccountLendingPoolDetails />
      <PoolTokenContext.Provider value={PoolTokenType.Collateral}>
        <AccountLendingPoolLPRow />
      </PoolTokenContext.Provider>
      <PoolTokenContext.Provider value={PoolTokenType.BorrowableA}>
        <AccountLendingPoolRow />
      </PoolTokenContext.Provider>
      <PoolTokenContext.Provider value={PoolTokenType.BorrowableB}>
        <AccountLendingPoolRow />
      </PoolTokenContext.Provider>
    </AccountLendingPoolContainer>
  );
}