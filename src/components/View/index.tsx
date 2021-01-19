import React from 'react';
import './index.scss';
import NavigationBarLink from '../NavigationBarLink';
import { HomeRoute, FarmingRoute } from '../../Routing';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useWallet } from 'use-wallet';
import { ConnectedWalletButtonComponent } from './ConnectedWalletButtonComponent';
import NavButton from './NavButton';

interface ViewProps {
  children: React.ReactNode;
}

/**
 * Creates a view component that wraps application page content.
 * @param param0 ViewProps
 */
export default function View({ children }: ViewProps) {
  const { connect, status } = useWallet();
  const onConnect = () => {
    try {
      localStorage.removeItem("signOut");
      connect('injected');
    } catch (error) {
      console.log(error)
    }
  };
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
            status === 'connected' ? 
              <ConnectedWalletButtonComponent /> :
              <NavButton variant="success" onClick={onConnect}>Connect Wallet</NavButton>
          }
        </Navbar>
        {children}
      </div>
  );
}