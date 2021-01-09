import React from "react";
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import { Home, Farm } from './views';

export interface AppRoute {
  value: string;
  to: string;
}

export const HomeRoute = {
  value: 'Home',
  to: '/'
} as AppRoute;

export const FarmRoute = {
  value: 'Farm',
  to: '/farming/:farmID'
} as AppRoute;

export const FarmingRoute = {
  value: 'Farming',
  to: '/farming'
} as AppRoute;

export enum AppRoutes {
  HomeRoute,
  FarmingRoute
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
            <Route path={FarmRoute.to}>
              <Farm />
            </Route>
          </Switch>
      </Router>
    </div>
  );
}