import React from 'react';
import { NavLink } from "react-router-dom";
import './index.scss';
import { AppRoute } from '../../Routing';
import Nav from 'react-bootstrap/Nav';

export interface NavigationBarLinkProps {
  appRoute: AppRoute;
}

export default function NavigationBarLink({ appRoute }: NavigationBarLinkProps ) {
  return (
    <div className="navigation-bar-link">
      <Nav>
        <NavLink
          className="menu-button text-lg text-lightest-gray"
          to={appRoute.to}
        >
          {appRoute.value}
        </NavLink>
      </Nav>
    </div>
  );
}