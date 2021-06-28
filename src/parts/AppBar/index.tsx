
import {
  NavLink,
  useRouteMatch
} from 'react-router-dom';
import { Disclosure } from '@headlessui/react';
import {
  MenuIcon,
  XIcon
} from '@heroicons/react/outline';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import clsx from 'clsx';

import ClaimAirdropButton from 'containers/ClaimAirdropButton';
import WalletConnect from 'containers/WalletConnect';
import ChainConnect from 'containers/ChainConnect';
import ConnectedWalletInfo from 'containers/ConnectedWalletInfo';
import { CHAIN_IDS } from 'config/web3/chains';
import { ReactComponent as ImpermaxLogoIcon } from 'assets/images/icons/impermax-logo.svg';
import {
  PAGES,
  PARAMETERS
} from 'utils/constants/links';

interface CustomProps {
  appBarHeight: number;
}

const AppBar = ({
  appBarHeight,
  className,
  ...rest
}: CustomProps & React.ComponentPropsWithRef<'nav'>): JSX.Element => {
  const {
    chainId,
    account
  } = useWeb3React<Web3Provider>();

  const NAVIGATION_ITEMS = [
    {
      title: 'Markets',
      link: PAGES.HOME,
      enabled: true,
      matched: (
        useRouteMatch({
          path: PAGES.HOME,
          strict: true
        })
      )?.isExact
    },
    {
      title: 'Dashboard',
      link: account ? PAGES.ACCOUNT.replace(`:${PARAMETERS.ACCOUNT}`, account) : '',
      enabled: !!account,
      matched: (
        useRouteMatch({
          path: PAGES.ACCOUNT,
          strict: true
        })
      )?.isExact
    },
    {
      title: 'User Guide',
      link: PAGES.USER_GUIDE,
      enabled: true,
      matched: (
        useRouteMatch({
          path: PAGES.USER_GUIDE,
          strict: true
        })
      )?.isExact
    },
    {
      title: 'Risks',
      link: PAGES.RISKS,
      enabled: chainId === CHAIN_IDS.ETHEREUM_MAIN_NET,
      matched: (
        useRouteMatch({
          path: PAGES.RISKS,
          strict: true
        })
      )?.isExact
    }
  ];

  return (
    <Disclosure
      as='nav'
      className={clsx(
        'bg-impermaxBlackHaze',
        'shadow',
        className
      )}
      {...rest}>
      {({ open }) => (
        <>
          <div
            className={clsx(
              'max-w-7xl',
              'mx-auto',
              'px-4',
              'sm:px-6',
              'lg:px-8'
            )}>
            <div
              style={{ height: appBarHeight }}
              className={clsx(
                'flex',
                'justify-between'
              )}>
              <div className='flex'>
                <div
                  className={clsx(
                    'flex-shrink-0',
                    'flex',
                    'items-center'
                  )}>
                  <NavLink to={PAGES.HOME}>
                    <ImpermaxLogoIcon
                      className='text-impermaxJade'
                      width={42}
                      height={39} />
                  </NavLink>
                </div>
                <div
                  className={clsx(
                    'hidden',
                    'sm:ml-6',
                    'sm:flex',
                    'sm:space-x-8'
                  )}>
                  {NAVIGATION_ITEMS.map(navigationItem => (
                    navigationItem.enabled ? (
                      <NavLink
                        key={navigationItem.title}
                        to={navigationItem.link}
                        className={clsx(
                          navigationItem.matched ?
                            'border-impermaxAstral-500 text-textPrimary' :
                            'border-transparent text-textSecondary hover:border-gray-300 hover:text-gray-700',
                          'inline-flex',
                          'items-center',
                          'px-1',
                          'pt-1',
                          'border-b-2',
                          'text-sm',
                          'font-medium'
                        )}>
                        {navigationItem.title}
                      </NavLink>
                    ) : null
                  ))}
                </div>
              </div>
              <div
                className={clsx(
                  'hidden',
                  'sm:ml-6',
                  'sm:flex',
                  'sm:items-center',
                  'space-x-2'
                )}>
                <ClaimAirdropButton />
                <ChainConnect />
                <ConnectedWalletInfo />
                <WalletConnect />
              </div>
              <div
                className={clsx(
                  '-mr-2',
                  'flex',
                  'items-center',
                  'sm:hidden'
                )}>
                {/* Mobile menu button */}
                <Disclosure.Button
                  className={clsx(
                    'inline-flex',
                    'items-center',
                    'justify-center',
                    'p-2',
                    'rounded-md',
                    'text-gray-400',
                    'hover:text-textSecondary',
                    'hover:bg-gray-100',
                    'focus:outline-none',
                    'focus:ring-2',
                    'focus:ring-inset',
                    'focus:ring-impermaxAstral-500'
                  )}>
                  <span className='sr-only'>Open main menu</span>
                  {open ? (
                    <XIcon
                      className={clsx(
                        'block',
                        'h-6',
                        'w-6'
                      )}
                      aria-hidden='true' />
                  ) : (
                    <MenuIcon
                      className={clsx(
                        'block',
                        'h-6',
                        'w-6'
                      )}
                      aria-hidden='true' />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>
          <Disclosure.Panel className='sm:hidden'>
            <div
              className={clsx(
                'pt-2',
                'pb-3',
                'space-y-1',
                'bg-impermaxBlackHaze'
              )}>
              {NAVIGATION_ITEMS.map(navigationItem => (
                navigationItem.enabled ? (
                  <NavLink
                    key={navigationItem.title}
                    to={navigationItem.link}
                    className={clsx(
                      navigationItem.matched ?
                        'bg-impermaxAstral-50 border-impermaxAstral-500 text-impermaxAstral-700' :
                        // eslint-disable-next-line max-len
                        'border-transparent text-textSecondary hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700',
                      'block',
                      'pl-3',
                      'pr-4',
                      'py-2',
                      'border-l-4',
                      'text-base',
                      'font-medium'
                    )}>
                    {navigationItem.title}
                  </NavLink>
                ) : null
              ))}
            </div>
            <div
              className={clsx(
                'pt-4',
                'pb-3',
                'border-t',
                'border-gray-200'
              )}>
              <div className='flex items-center px-4'>
                <ClaimAirdropButton />
                <WalletConnect />
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default AppBar;
