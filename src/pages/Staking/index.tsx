
import clsx from 'clsx';

import Layout from 'parts/Layout';
import Information from './Information';
import Logo from './Logo';

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
            'lg:grid'
          )}
          style={{
            width: 224,
            height: 224
          }} />
      </div>
    </Layout>
  );
};

export default Staking;
