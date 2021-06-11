
import {
  Switch,
  Route
} from 'react-router-dom';
// ray test touch <<
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
// ray test touch >>

// ray test touch <<
import Layout from 'parts/Layout';
// ray test touch >>
import Home from 'pages/Home';
import LendingPool from 'pages/LendingPool';
import Risks from 'pages/Risks';
import Claim from 'pages/Claim';
import CreateNewPair from 'pages/CreateNewPair';
import Account from 'pages/Account';
// ray test touch <<
import LanguageProvider from 'contexts/LanguageProvider';
import NetworkProvider from 'contexts/NetworkProvider';
import { ImpermaxRouterProvider } from 'contexts/ImpermaxRouterProvider';
import { SubgraphProvider } from 'contexts/SubgraphProvider';
import Updater from 'store/transactions/updater';
// ray test touch >>
import { PAGES } from 'utils/constants/links';
import './app.scss';

const App = (): JSX.Element | null => {
  // ray test touch <<
  const { chainId } = useWeb3React<Web3Provider>();
  // ray test touch >>

  return (
    <Layout>
      {chainId ? (
        <NetworkProvider>
          <LanguageProvider>
            <Updater />
            <SubgraphProvider>
              <ImpermaxRouterProvider>
                <Switch>
                  <Route path={PAGES.CREATE_NEW_PAIR}>
                    <CreateNewPair />
                  </Route>
                  <Route path={PAGES.LENDING_POOL}>
                    <LendingPool />
                  </Route>
                  <Route path={PAGES.ACCOUNT}>
                    <Account />
                  </Route>
                  <Route path={PAGES.CLAIM}>
                    <Claim />
                  </Route>
                  <Route path={PAGES.RISKS}>
                    <Risks />
                  </Route>
                  {/* ray test touch < */}
                  <Route
                    path={PAGES.USER_GUIDE}
                    component={() => {
                      // TODO: should use <a /> with security attributes
                      window.location.href = 'https://impermax.finance/User-Guide-Impermax.pdf';
                      return null;
                    }} />
                  {/* ray test touch > */}
                  <Route
                    path={PAGES.HOME}
                    exact>
                    <Home />
                  </Route>
                </Switch>
              </ImpermaxRouterProvider>
            </SubgraphProvider>
          </LanguageProvider>
        </NetworkProvider>
      // TODO: could add more obvious UX
      ) : null}
    </Layout>
  );
};

export default App;
