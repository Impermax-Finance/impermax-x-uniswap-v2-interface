
import * as React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { UseWalletProvider } from 'use-wallet';
import clsx from 'clsx';

import Home from 'pages/Home';
import LendingPool from 'pages/LendingPool';
import Risks from 'pages/Risks';
import Claim from 'pages/Claim';
import CreateNewPair from 'pages/CreateNewPair';
import Account from 'pages/Account';
// TODO: should move the providers to `src\index.tsx`
import CustomWeb3Provider from 'contexts/Web3Provider';
import { ImpermaxRouterProvider } from 'contexts/ImpermaxRouterProvider';
import { SubgraphProvider } from 'contexts/SubgraphProvider';
import { PAGES } from 'utils/constants/links';
import Updater from 'store/transactions/updater';
import './app.scss';

const App = (): JSX.Element => {
  const { chainId = 0 } = useWeb3React<Web3Provider>();

  return (
    <div
      className={clsx(
        'min-h-screen',
        'bg-default'
      )}>
      <UseWalletProvider chainId={chainId}>
        <CustomWeb3Provider>
          <Updater />
          <SubgraphProvider>
            <ImpermaxRouterProvider>
              <Router>
                <Switch>
                  <Route path={PAGES.createNewPair.to}>
                    <CreateNewPair />
                  </Route>
                  <Route path={PAGES.lendingPool.to}>
                    <LendingPool />
                  </Route>
                  <Route path={PAGES.account.to}>
                    <Account />
                  </Route>
                  <Route path={PAGES.claim.to}>
                    <Claim />
                  </Route>
                  <Route path={PAGES.risks.to}>
                    <Risks />
                  </Route>
                  {/* ray test touch < */}
                  <Route
                    path={PAGES.userGuide.to}
                    component={() => {
                      // TODO: should use <a /> with security attributes
                      window.location.href = 'https://impermax.finance/User-Guide-Impermax.pdf';
                      return null;
                    }} />
                  {/* ray test touch > */}
                  <Route
                    path={PAGES.home.to}
                    exact>
                    <Home />
                  </Route>
                </Switch>
              </Router>
            </ImpermaxRouterProvider>
          </SubgraphProvider>
        </CustomWeb3Provider>
      </UseWalletProvider>
    </div>
  );
};

export default App;
