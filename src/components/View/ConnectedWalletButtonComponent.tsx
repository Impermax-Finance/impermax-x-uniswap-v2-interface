import React from 'react';
import { useWallet } from 'use-wallet';
import AccountAddress from './AccountAddress';
import NavButton from './NavButton';

function shortenAddress(address: string) {
    return address.substring(0,6) + '...' + address.slice(-4)
}

/**
 * Sets up a component for the application's wallet section, when the wallet is connected.
 */
export function ConnectedWalletButtonComponent() {
  const { account, reset } = useWallet();
  return <div className="connected-wallet">
    <AccountAddress>{ shortenAddress(account) }</AccountAddress>
    <NavButton variant="success" onClick={() => reset()}>Logout</NavButton>
  </div>
}