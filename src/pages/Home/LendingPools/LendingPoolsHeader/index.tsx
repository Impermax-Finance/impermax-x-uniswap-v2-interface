
import * as React from 'react';
import clsx from 'clsx';

import LendingPoolDesktopGridWrapper from 'pages/Home/LendingPools/LendingPool/LendingPoolDesktopGridWrapper';
import QuestionHelper from 'components/QuestionHelper';

const Heading = ({
  className,
  children,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <h6
    className={clsx(
      'truncate',
      className
    )}
    {...rest}>
    {children}
  </h6>
);

const LendingPoolsHeader = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => {
  return (
    <LendingPoolDesktopGridWrapper
      className={clsx(
        'text-textSecondary',
        'text-sm',
        className
      )}
      {...rest}>
      <Heading className='col-span-3'>
        Market
      </Heading>
      <Heading>Total Supply</Heading>
      <Heading>Total Borrowed</Heading>
      <Heading>Supply APY</Heading>
      <Heading>Borrow APY</Heading>
      <Heading
        className={clsx(
          'flex',
          'items-center',
          'space-x-1'
        )}>
        <span>Leveraged LP APY</span>
        <QuestionHelper
          placement='left'
          text='Based on last 7 days trading fees assuming a 5x leverage' />
      </Heading>
    </LendingPoolDesktopGridWrapper>
  );
};

export default LendingPoolsHeader;
