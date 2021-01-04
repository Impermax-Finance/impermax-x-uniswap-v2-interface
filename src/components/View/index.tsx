import React from 'react';
import { NavLink } from "react-router-dom";
import './index.scss';
import NavigationBarLink from '../NavigationBarLink';
import { HomeRoute, FarmingRoute } from '../../Routing';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

interface ViewProps {
  children: React.ReactNode;
}

export default function View({ children }: ViewProps) {
  return (
      <div className="view">
        <Navbar>
          <Navbar.Brand>Icon</Navbar.Brand>
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