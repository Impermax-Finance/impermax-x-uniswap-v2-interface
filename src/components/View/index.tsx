import React, { useMemo } from 'react';
import './index.scss';
import NavigationBarLink from '../NavigationBarLink';
import { HomeRoute, FarmingRoute } from '../../Routing';

import { Button, Nav, Navbar, Container } from 'react-bootstrap';
import { useWallet } from 'use-wallet';
import { ConnectedWalletButtonComponent } from './ConnectedWalletButtonComponent';
import { useAllTransactions, isTransactionRecent } from '../../state/transactions/hooks';
import { TransactionDetails } from '../../state/transactions/reducer';

function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

const MAX_TRANSACTION_HISTORY = 10;

interface ViewProps {
  children: React.ReactNode;
}

/**
 * Creates a view component that wraps application page content.
 * @param param0 ViewProps
 */
export default function View({ children }: ViewProps) {
  const { account, connect } = useWallet();
  const onConnect = () => {
    try {
      localStorage.removeItem("signOut");
      connect('injected');
    } catch (error) {
      console.log(error)
    }
  };

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst);
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash);
  const confirmed = sortedRecentTransactions.filter(tx => tx.receipt).map(tx => tx.hash).slice(0, MAX_TRANSACTION_HISTORY);
  console.log(sortedRecentTransactions, pending, confirmed);
  
  return (
    <div className="view">
      <Navbar>
        <Container>
          <Navbar.Brand>
            <img className='impermax-brand' src="/build/assets/impermax.png" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Nav className="mr-auto">
            <NavigationBarLink appRoute={HomeRoute} />
          </Nav>
          {
            account ? 
              <ConnectedWalletButtonComponent account={account} /> :
              <Button className="wallet-connector nav-button-green" onClick={onConnect}>Connect Wallet</Button>
          }
        </Container>
      </Navbar>
      {children}
    </div>
  );
}