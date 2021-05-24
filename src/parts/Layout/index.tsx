import * as React from 'react';

import AppBar from 'parts/AppBar';
import Footer from 'parts/Footer';
import './index.scss';

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props): JSX.Element => (
  <div className='layout'>
    <AppBar />
    {children}
    <Footer />
  </div>
);

export default Layout;
