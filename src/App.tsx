
import {
  Switch,
  Route
} from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import Layout from 'parts/Layout';
import Home from 'pages/Home';
import LendingPool from 'pages/LendingPool';
import Risks from 'pages/Risks';
import Claim from 'pages/Claim';
import CreateNewPair from 'pages/CreateNewPair';
import Account from 'pages/Account';
import ImpermaxRouterProvider from 'contexts/ImpermaxRouterProvider';
import SubgraphProvider from 'contexts/SubgraphProvider';
import Updater from 'store/transactions/updater';
import { PAGES } from 'utils/constants/links';
import './app.scss';

const App = (): JSX.Element | null => {
  // TODO: double-check
  const { chainId } = useWeb3React<Web3Provider>();

  return (
    <Layout>
      <Updater />
      {/* TODO: should fix properly */}
      <Switch>
        <Route path={PAGES.CREATE_NEW_PAIR}>
          {chainId ? (
            <SubgraphProvider key={chainId}>
              <ImpermaxRouterProvider>
                <CreateNewPair />
              </ImpermaxRouterProvider>
            </SubgraphProvider>
          ) : null}
        </Route>
        <Route path={PAGES.LENDING_POOL}>
          {chainId ? (
            <SubgraphProvider key={chainId}>
              <ImpermaxRouterProvider>
                <LendingPool />
              </ImpermaxRouterProvider>
            </SubgraphProvider>
          ) : null}
        </Route>
        <Route path={PAGES.ACCOUNT}>
          {chainId ? (
            <SubgraphProvider key={chainId}>
              <ImpermaxRouterProvider>
                <Account />
              </ImpermaxRouterProvider>
            </SubgraphProvider>
          ) : null}
        </Route>
        <Route path={PAGES.CLAIM}>
          {chainId ? (
            <SubgraphProvider key={chainId}>
              <ImpermaxRouterProvider>
                <Claim />
              </ImpermaxRouterProvider>
            </SubgraphProvider>
          ) : null}
        </Route>
        <Route path={PAGES.RISKS}>
          {chainId ? (
            <SubgraphProvider key={chainId}>
              <ImpermaxRouterProvider>
                <Risks />
              </ImpermaxRouterProvider>
            </SubgraphProvider>
          ) : null}
        </Route>
        <Route
          path={PAGES.USER_GUIDE}
          component={() => {
            // TODO: should use <a /> with security attributes
            window.location.href = 'https://impermax.finance/User-Guide-Impermax.pdf';
            return null;
          }} />
        <Route
          path={PAGES.HOME}
          exact>
          {chainId ? (
            <Home key={chainId} />
          // TODO: should improve in a more explicit way
          ) : null}
        </Route>
      </Switch>
    </Layout>
  );
};

export default App;
