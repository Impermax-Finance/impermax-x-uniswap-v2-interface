import React from 'react';
import { useWallet } from 'use-wallet';
import AccountAddress from './AccountAddress';
import NavButton from './NavButton';

/**
 * Sets up a component for the application's wallet section, when the wallet is connected.
 */
export function ConnectedWalletButtonComponent() {
  const { account, reset } = useWallet();
  return <div className="connected-wallet">
    <AccountAddress>{ account }</AccountAddress>
    <NavButton variant="success" onClick={() => reset()}>Logout</NavButton>
  </div>
}