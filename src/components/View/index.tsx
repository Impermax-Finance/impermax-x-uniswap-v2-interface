import React from 'react';
import './index.scss';
import NavigationBarLink from '../NavigationBarLink';
import { HomeRoute, FarmingRoute } from '../../Routing';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

interface ViewProps {
  children: React.ReactNode;
}

/**
 * Creates a view component that wraps application page content.
 * @param param0 ViewProps
 */
export default function View({ children }: ViewProps) {
  return (
      <div className="view">
        <Navbar>
          <Navbar.Brand>
            <img className='impermax-brand' src="assets/impermax.png" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Nav className="mr-auto">
            <NavigationBarLink appRoute={HomeRoute} />
            <NavigationBarLink appRoute={FarmingRoute} />
          </Nav>
        </Navbar>
        {children}
      </div>
  );
}