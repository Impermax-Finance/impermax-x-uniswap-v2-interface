
import {
  Switch,
  Route
} from 'react-router-dom';

import Home from 'pages/Home';
import LendingPool from 'pages/LendingPool';
import Risks from 'pages/Risks';
import Claim from 'pages/Claim';
import CreateNewPair from 'pages/CreateNewPair';
import Account from 'pages/Account';
import { PAGES } from 'utils/constants/links';
import './app.scss';

const App = (): JSX.Element => {
  return (
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
  );
};

export default App;
