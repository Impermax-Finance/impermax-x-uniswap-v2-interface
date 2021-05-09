import React from 'react';
import './index.scss';
import NavigationBarLink from '../NavigationBarLink';
import { HomeRoute, RisksRoute, UserGuideRoute } from '../../Routing';

import { Button, Nav, Navbar, Container } from 'react-bootstrap';
import { useWallet } from 'use-wallet';
import { ConnectedWalletButtonComponent } from './ConnectedWalletButtonComponent';
import { useNetworkName } from '../../hooks/useNetwork';
import { useHasClaimableAirdrop } from '../../hooks/useData';
import { ClaimAirdrop } from './ClaimAirdrop';
import { useThisAccountUrl } from '../../hooks/useUrlGenerator';

interface ViewProps {
  children: React.ReactNode;
}

/**
 * Creates a view component that wraps application page content.
 * @param param0 ViewProps
 */

export default function View({ children }: ViewProps): JSX.Element {
  const { account, connect, status, error } = useWallet();
  const onConnect = () => {
    try {
      localStorage.removeItem('signOut');
      connect('injected');
    } catch (error) {
      console.log(error);
    }
  };

  // eslint-disable-next-line eqeqeq
  const wrongNetwork = status == 'error' && error && error.toString().indexOf('ChainUnsupportedError') >= 0;
  const networkName = useNetworkName();
  // eslint-disable-next-line eqeqeq
  const connected = status == 'connected';

  const hasClaimableAirdrop = useHasClaimableAirdrop();
  const accountUrl = useThisAccountUrl();

  return (
    <div className='view'>
      <Navbar>
        <Container>
          <Navbar.Brand>
            <a
              href='https://impermax.finance/'
              target='_blank'>
              <img
                className='impermax-brand'
                src='/assets/impermax.png' />
            </a>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Nav className='mr-auto'>
            <NavigationBarLink appRoute={HomeRoute} />
            {accountUrl && (<NavigationBarLink appRoute={{ value: 'Dashboard', to: accountUrl }} />)}
            <NavigationBarLink
              appRoute={UserGuideRoute}
              target='_blank' />
            {networkName === 'mainnet' && (<NavigationBarLink appRoute={RisksRoute} />)}
            {/* <NavigationBarLink appRoute={ClaimRoute} />*/}
            {/* <NavigationBarLink appRoute={CreateNewPairRoute} />*/}
          </Nav>
          {hasClaimableAirdrop && (<ClaimAirdrop />)}
          {
            account ?
              <ConnectedWalletButtonComponent account={account} /> :
              <Button
                className='wallet-connector nav-button-green'
                onClick={onConnect}>Connect Wallet
              </Button>
          }
        </Container>
      </Navbar>
      {!connected && wrongNetwork && (
        <div className='wrong-network'>
          <div className='container'>
            You&apos;re connected to the wrong network. Please connect to the supported network: {networkName}
          </div>
        </div>
      )}
      {!connected && !wrongNetwork && (
        <div className='not-connected'>
          <div className='container'>
            Please connect with Metamask or another web3 provider
          </div>
        </div>
      )}
      {children}
      <div className='footer container'>
        <a
          href='https://impermax.finance/'
          target='_blank'>Website
        </a>
        <a
          href='https://twitter.com/ImpermaxFinance'
          target='_blank'>Twitter
        </a>
        <a
          href='https://t.me/ImpermaxFinance'
          target='_blank'>Telegram
        </a>
        <a
          href='https://discord.gg/XN739EgG4X'
          target='_blank'>Discord
        </a>
        <a
          href='https://impermax.medium.com/'
          target='_blank'>Medium
        </a>
        <a
          href='https://www.reddit.com/r/ImpermaxFinance/'
          target='_blank'>Reddit
        </a>
        <a
          href='https://github.com/Impermax-Finance'
          target='_blank'>Github
        </a>
      </div>
    </div>
  );
}
