import React from 'react';
import './index.scss';
import NavigationBarLink from '../NavigationBarLink';
import { HomeRoute, FarmingRoute } from '../../Routing';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useWallet } from 'use-wallet';
import { Button } from 'react-bootstrap';

interface ViewProps {
  children: React.ReactNode;
}

/**
 * Creates a view component that wraps application page content.
 * @param param0 ViewProps
 */
export default function View({ children }: ViewProps) {
  const { connect, account, reset } = useWallet();
  return (
      <div className="view">
        <Navbar>
          <Navbar.Brand>
            <img className='impermax-brand' src="/build/assets/impermax.png" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Nav className="mr-auto">
            <NavigationBarLink appRoute={HomeRoute} />
            <NavigationBarLink appRoute={FarmingRoute} />
          </Nav>
          {
            !account ? 
              <Button onClick={() => connect("provided")}>Connect</Button> :
              <Button onClick={() => reset()}>Logout</Button>
          }
        </Navbar>
        {children}
      </div>
  );
}