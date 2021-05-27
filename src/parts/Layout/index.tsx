import * as React from 'react';
import clsx from 'clsx';

import AppBar from 'parts/AppBar';
import Footer from 'parts/Footer';
import { LAYOUT } from 'utils/constants/styles';

const Layout = ({
  children,
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <div
    style={{
      paddingTop: LAYOUT.appBarHeight
    }}
    className={clsx(
      'bg-impermaxBlackHaze',
      'relative',
      'min-h-screen',
      className
    )}
    {...rest}>
    <AppBar
      appBarHeight={LAYOUT.appBarHeight}
      className={clsx(
        'fixed',
        'top-0',
        'right-0',
        'left-0',
        'z-impermaxAppBar'
      )} />
    {children}
    <Footer />
  </div>
);

export default Layout;
