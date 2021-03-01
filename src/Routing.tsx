import React from "react";
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import { Home, LendingPool, Risks } from './views';

export interface AppRoute {
  value: string;
  to: string;
}

export const HomeRoute = {
  value: 'Home',
  to: '/'
} as AppRoute;

export const LendingPoolRoute = {
  value: 'LendingPool',
  to: '/lending-pool/:uniswapV2PairAddress'
} as AppRoute;

export const FarmingRoute = {
  value: 'Farming',
  to: '/farming'
} as AppRoute;

export const RisksRoute = {
  value: 'Risks',
  to: '/risks'
} as AppRoute;

export const UserGuideRoute = {
  value: 'User Guide',
  to: '/user-guide'
} as AppRoute;

export enum AppRoutes {
  HomeRoute,
  RisksRoute,
  FarmingRoute,
  UserGuideRoute
}

/**
 * Generates the application routing structure.
 */
export default function Routing() {
  return (
    <div className="routing">
      <Router>
          <Switch>
            <Route path={HomeRoute.to} exact>
              <Home />
            </Route>
            <Route path={LendingPoolRoute.to}>
              <LendingPool />
            </Route>
            <Route path={RisksRoute.to}>
              <Risks />
            </Route>
            <Route path={UserGuideRoute.to} component={() : any => { 
              window.location.href = 'https://docs.google.com/document/d/1_lSfEVrD693W7teFvuXyI6XVJj9P4A6XhqaX9Pz6V58/edit?usp=sharing'; 
              return null;
            }} />
          </Switch>
      </Router>
    </div>
  );
}