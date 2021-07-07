
import clsx from 'clsx';

import Layout from 'parts/Layout';
import Information from './Information';
import Logo from './Logo';
import APRCard from './APRCard';
import FormCard from './FormCard';

const Staking = (): JSX.Element => {
  return (
    <Layout
      wrapperClassName={clsx(
        'flex',
        'flex-col',
        'items-center'
      )}>
      <div
        className={clsx(
          'flex',
          'items-center',
          'space-x-6'
        )}>
        <Information className='max-w-xl' />
        <Logo
          className={clsx(
            'hidden',
            'lg:grid',
            'w-72'
          )} />
      </div>
      <div
        className={clsx(
          'flex',
          'space-x-6'
        )}>
        <div
          className={clsx(
            'max-w-xl',
            'space-y-4'
          )}>
          <APRCard />
          <FormCard />
        </div>
        <div className='w-72'>BalanceCard</div>
      </div>
    </Layout>
  );
};

export default Staking;
