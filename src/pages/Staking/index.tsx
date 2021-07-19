import clsx from 'clsx';

import Layout from 'parts/Layout';
import Information from './Information';
import Logo from './Logo';
import APYCard from './APYCard';
import FormCard from './FormCard';
import BalanceCard from './BalanceCard';

const MD_WIDTH_72_CLASS = 'md:w-72';

const Staking = (): JSX.Element => (
  <Layout>
    <div
      className={clsx(
        'space-y-6',
        'max-w-6xl',
        'mx-auto',
        'my-4'
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
            MD_WIDTH_72_CLASS
          )} />
      </div>
      <div
        className={clsx(
          'md:flex',
          'md:justify-center',
          'space-y-6',
          'md:space-y-0',
          'md:space-x-6',
          'w-full'
        )}>
        <div
          className={clsx(
            'space-y-4',
            'max-w-xl',
            'flex-grow'
          )}>
          <APYCard />
          <FormCard />
        </div>
        <BalanceCard className={MD_WIDTH_72_CLASS} />
      </div>
    </div>
  </Layout>
);

export default Staking;
