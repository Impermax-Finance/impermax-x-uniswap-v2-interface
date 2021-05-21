
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

const AppBar = (): JSX.Element => {
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
    <>
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
      {/* ray test touch < */}
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
      {/* ray test touch > */}
    </>
  );
};

export default AppBar;
