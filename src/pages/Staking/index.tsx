
import clsx from 'clsx';

import Layout from 'parts/Layout';
import Information from './Information';
import Logo from './Logo';
import APRCard from './APRCard';
import FormCard from './FormCard';
import BalanceCard from './BalanceCard';

const WIDTH_72_CLASS = 'w-72';

const Staking = (): JSX.Element => {
  return (
    <Layout>
      <div
        className={clsx(
          'space-y-6',
          'max-w-6xl',
          'mx-auto'
        )}>
        <div
          className={clsx(
            'md:flex',
            'md:justify-center',
            'md:items-center',
            'md:space-x-6',
            'w-full'
          )}>
          <Information
            className={clsx(
              'max-w-xl',
              'flex-grow'
            )} />
          <Logo
            className={clsx(
              'flex-shrink-0',
              'hidden',
              'lg:grid',
              WIDTH_72_CLASS
            )} />
        </div>
        <div
          className={clsx(
            'md:flex',
            'md:justify-center',
            'space-y-6',
            'md:space-x-6',
            'w-full'
          )}>
          <div
            className={clsx(
              'space-y-4',
              'max-w-xl',
              'flex-grow'
            )}>
            <APRCard />
            <FormCard />
          </div>
          <BalanceCard className={WIDTH_72_CLASS} />
        </div>
      </div>
    </Layout>
  );
};

export default Staking;
