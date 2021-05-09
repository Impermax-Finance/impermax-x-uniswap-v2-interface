import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Home, LendingPool, Risks, Claim, CreateNewPair, Account } from './views';

export interface AppRoute {
  value: string;
  to: string;
}

export const HomeRoute = {
  value: 'Markets',
  to: '/'
} as AppRoute;

export const LendingPoolRoute = {
  value: 'LendingPool',
  to: '/lending-pool/:uniswapV2PairAddress'
} as AppRoute;

export const AccountRoute = {
  value: 'AccountRoute',
  to: '/account/:account'
} as AppRoute;

export const CreateNewPairRoute = {
  value: 'Create New Pair',
  to: '/create-new-pair'
} as AppRoute;

export const RisksRoute = {
  value: 'Risks',
  to: '/risks'
} as AppRoute;

export const ClaimRoute = {
  value: 'Claim',
  to: '/claim'
} as AppRoute;

export const UserGuideRoute = {
  value: 'User Guide',
  to: '/user-guide'
} as AppRoute;

export enum AppRoutes {
  HomeRoute,
  LendingPoolRoute,
  CreateNewPairRoute,
  RisksRoute,
  ClaimRoute,
  UserGuideRoute,
  AccountRoute,
}

/**
 * Generates the application routing structure.
 */

export default function Routing(): JSX.Element {
  return (
    <div className='routing'>
      <Router>
        <Switch>
          <Route
            path={HomeRoute.to}
            exact>
            <Home />
          </Route>
          <Route path={CreateNewPairRoute.to}>
            <CreateNewPair />
          </Route>
          <Route path={LendingPoolRoute.to}>
            <LendingPool />
          </Route>
          <Route path={AccountRoute.to}>
            <Account />
          </Route>
          <Route path={ClaimRoute.to}>
            <Claim />
          </Route>
          <Route path={RisksRoute.to}>
            <Risks />
          </Route>
          <Route
            path={UserGuideRoute.to}
            component={() : any => {
              window.location.href = 'https://impermax.finance/User-Guide-Impermax.pdf';
              return null;
            }} />
        </Switch>
      </Router>
    </div>
  );
}
