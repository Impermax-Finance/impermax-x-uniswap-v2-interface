import React from 'react';
import { useWallet } from 'use-wallet';
import { Button } from 'react-bootstrap';

function shortenAddress(address: string) {
    return address.substring(0,6) + '...' + address.slice(-4)
}

/**
 * Sets up a component for the application's wallet section, when the wallet is connected.
 */
export function ConnectedWalletButtonComponent() {
  const { account } = useWallet();
  return <div className="connected-wallet">
    <Button className="wallet-connector nav-button-light">Transactions</Button>
    <Button className="wallet-connector nav-button-green">{ shortenAddress(account) }</Button>
  </div>
}