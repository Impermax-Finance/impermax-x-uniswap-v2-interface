import clsx from 'clsx';

import Layout from 'parts/Layout';
import Information from './Information';
import React from 'react';
import VaultCardIMXxIMX from './VaultCardIMXxIMX';

interface ContainerProps {
  children: React.ReactNode;
}

const InternalContainer = ({
  children
}: ContainerProps) => (
  <div
    className={clsx(
      'md:flex',
      'md:justify-center',
      'space-y-6',
      'md:space-y-0',
      'md:space-x-6',
      'w-full'
    )}>
    {children}
  </div>
);

const Staking = (): JSX.Element => (
  <Layout>
    <div
      className={clsx(
        'space-y-8',
        'max-w-4xl',
        'mx-auto',
        'my-4'
      )}>
      <InternalContainer>
        <Information
          className={clsx(
            'flex-grow'
          )} />
      </InternalContainer>
      <InternalContainer>
        <VaultCardIMXxIMX
          className={clsx(
            'flex-grow'
          )} />
      </InternalContainer>
    </div>
  </Layout>
);

export default Staking;
