
import {
  Nav,
  Navbar,
  Container
} from 'react-bootstrap';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import clsx from 'clsx';

import { ClaimAirdrop } from './ClaimAirdrop';
import WalletConnect from 'parts/WalletConnect';
import NavigationBarLink from 'components/NavigationBarLink';
import { useHasClaimableAirdrop } from 'hooks/useData';
import { CHAIN_IDS } from 'config/web3/blockchain';
import {
  PAGES,
  PARAMETERS
} from 'utils/constants/links';

const AppBar = (): JSX.Element => {
  const {
    chainId,
    account
  } = useWeb3React<Web3Provider>();

  const hasClaimableAirdrop = useHasClaimableAirdrop();
  const accountPageURL = account && PAGES.account.to.replace(`:${PARAMETERS.ACCOUNT}`, account);

  // ray test touch <
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
            {accountPageURL && (
              <NavigationBarLink appRoute={{ value: 'Dashboard', to: accountPageURL }} />
            )}
            <NavigationBarLink
              appRoute={PAGES.userGuide}
              target='_blank' />
            {chainId === CHAIN_IDS.ETHEREUM_MAIN_NET && (
              <NavigationBarLink appRoute={PAGES.risks} />
            )}
          </Nav>
          {hasClaimableAirdrop && (
            <ClaimAirdrop />
          )}
          <WalletConnect />
        </Container>
      </Navbar>
    </>
  );
  // ray test touch >
};

export default AppBar;
