
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import { UseWalletProvider } from 'use-wallet';

import Home from 'pages/Home';
import LendingPool from 'pages/LendingPool';
import Risks from 'pages/Risks';
import Claim from 'pages/Claim';
import CreateNewPair from 'pages/CreateNewPair';
import Account from 'pages/Account';
// ray test touch <
// TODO: should move the providers to `src\index.tsx`
// ray test touch >
import Web3Provider from 'contexts/Web3Provider';
import { ImpermaxRouterProvider } from 'contexts/ImpermaxRouterProvider';
import { SubgraphProvider } from 'contexts/SubgraphProvider';
import Updaters from 'state/Updaters';
import { useChainId } from 'hooks/useNetwork';
import { PAGES } from 'utils/constants/links';
import './app.scss';

const App = (): JSX.Element => {
  return (
    <div className='app'>
      <UseWalletProvider chainId={useChainId()}>
        <Web3Provider>
          <Updaters />
          <SubgraphProvider>
            <ImpermaxRouterProvider>
              <Router>
                <Switch>
                  <Route
                    path={PAGES.home.to}
                    exact>
                    <Home />
                  </Route>
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
                  <Route
                    path={PAGES.userGuide.to}
                    component={() => {
                      // TODO: should use <a /> with security attributes
                      window.location.href = 'https://impermax.finance/User-Guide-Impermax.pdf';
                      return null;
                    }} />
                </Switch>
              </Router>
            </ImpermaxRouterProvider>
          </SubgraphProvider>
        </Web3Provider>
      </UseWalletProvider>
    </div>
  );
};

export default App;
