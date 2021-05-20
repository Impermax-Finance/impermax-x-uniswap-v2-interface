import * as React from 'react';
import {
  Button,
  Nav,
  Navbar,
  Container
} from 'react-bootstrap';
import { useWallet } from 'use-wallet';
import clsx from 'clsx';

import { ClaimAirdrop } from './ClaimAirdrop';
import { ConnectedWalletButtonComponent } from './ConnectedWalletButtonComponent';
import WalletConnect from 'parts/WalletConnect';
import NavigationBarLink from 'components/NavigationBarLink';
import { useNetworkName } from 'hooks/useNetwork';
import { useHasClaimableAirdrop } from 'hooks/useData';
import { useThisAccountUrl } from 'hooks/useUrlGenerator';
import { PAGES } from 'utils/constants/links';
import './index.scss';

interface Props {
  children: React.ReactNode;
}

const View = ({ children }: Props): JSX.Element => {
  // ray test touch <
  const {
    account,
    connect,
    status,
    error
  } = useWallet();
  // ray test touch >

  const onConnect = () => {
    try {
      localStorage.removeItem('signOut');
      connect('injected');
    } catch (error) {
      console.log(error);
    }
  };

  const wrongNetwork = status === 'error' && error && error.toString().indexOf('ChainUnsupportedError') >= 0;
  // ray test touch <
  const networkName = useNetworkName();
  // ray test touch >
  const connected = status === 'connected';

  const hasClaimableAirdrop = useHasClaimableAirdrop();
  // ray test touch <
  const accountUrl = useThisAccountUrl();
  // ray test touch >

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
                src='/assets/impermax.png'
                alt='impermax' />
            </a>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Nav className='mr-auto'>
            <NavigationBarLink appRoute={PAGES.home} />
            {accountUrl && (
              <NavigationBarLink appRoute={{ value: 'Dashboard', to: accountUrl }} />
            )}
            <NavigationBarLink
              appRoute={PAGES.userGuide}
              target='_blank' />
            {/* ray test touch < */}
            {networkName === 'mainnet' && (
              <NavigationBarLink appRoute={PAGES.risks} />
            )}
            {/* ray test touch > */}
            {/* <NavigationBarLink appRoute={PAGES.claim} />*/}
            {/* <NavigationBarLink appRoute={PAGES.CreateNewPair} />*/}
          </Nav>
          {hasClaimableAirdrop && (
            <ClaimAirdrop />
          )}
          {account ? (
            <ConnectedWalletButtonComponent account={account} />
          ) : (
            <Button
              className='wallet-connector nav-button-green'
              onClick={onConnect}>
              Connect Wallet
            </Button>
          )}
          <WalletConnect />
        </Container>
      </Navbar>
      {!connected && wrongNetwork && (
        <div className='wrong-network'>
          <div className='container'>
            You&apos;re connected to the wrong network. Please connect to the supported network: {networkName}.
          </div>
        </div>
      )}
      {!connected && !wrongNetwork && (
        <div className='not-connected'>
          <div className='container'>
            Please connect with Metamask or another web3 provider.
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
};

export default View;
