import React from 'react';
import './index.scss';
import NavigationBarLink from '../NavigationBarLink';
import { PAGES } from 'utils/constants/links';
import { Button, Nav, Navbar, Container } from 'react-bootstrap';
import { useWallet } from 'use-wallet';
import { ConnectedWalletButtonComponent } from './ConnectedWalletButtonComponent';
import { useNetworkName } from '../../hooks/useNetwork';
import { useHasClaimableAirdrop } from '../../hooks/useData';
import { ClaimAirdrop } from './ClaimAirdrop';
import { useThisAccountUrl } from '../../hooks/useUrlGenerator';
import clsx from 'clsx';

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
              target='_blank'
              rel='noopener noreferrer'>
              <img
                className={clsx(
                  'impermax-brand',
                  'inline-block'
                )}
                src='/assets/impermax.png' />
            </a>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Nav className='mr-auto'>
            <NavigationBarLink appRoute={PAGES.home} />
            {accountUrl && (<NavigationBarLink appRoute={{ value: 'Dashboard', to: accountUrl }} />)}
            <NavigationBarLink
              appRoute={PAGES.userGuide}
              target='_blank' />
            {networkName === 'mainnet' && (<NavigationBarLink appRoute={PAGES.risks} />)}
            {/* <NavigationBarLink appRoute={PAGES.claim} />*/}
            {/* <NavigationBarLink appRoute={PAGES.CreateNewPair} />*/}
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
          target='_blank'
          rel='noopener noreferrer'>
          Website
        </a>
        <a
          href='https://twitter.com/ImpermaxFinance'
          target='_blank'
          rel='noopener noreferrer'>
          Twitter
        </a>
        <a
          href='https://t.me/ImpermaxFinance'
          target='_blank'
          rel='noopener noreferrer'>
          Telegram
        </a>
        <a
          href='https://discord.gg/XN739EgG4X'
          target='_blank'
          rel='noopener noreferrer'>
          Discord
        </a>
        <a
          href='https://impermax.medium.com/'
          target='_blank'
          rel='noopener noreferrer'>
          Medium
        </a>
        <a
          href='https://www.reddit.com/r/ImpermaxFinance/'
          target='_blank'
          rel='noopener noreferrer'>
          Reddit
        </a>
        <a
          href='https://github.com/Impermax-Finance'
          target='_blank'
          rel='noopener noreferrer'>
          Github
        </a>
      </div>
    </div>
  );
}
