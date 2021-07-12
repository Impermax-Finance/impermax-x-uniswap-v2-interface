
import clsx from 'clsx';

import Layout from 'parts/Layout';
import Information from './Information';
import Logo from './Logo';
import APYCard from './APYCard';
import FormCard from './FormCard';
import { Provider } from 'react-redux';
import Updater from 'store/transactions/updater';
import store from 'store';
import ImpermaxRouterProvider from 'contexts/ImpermaxRouterProvider';
import SubgraphProvider from 'contexts/SubgraphProvider';

const Staking = (): JSX.Element => {
  const chainId = 3; // TODO create setting
  return (
    <Provider store={store}>
      <Layout>
        <Updater />
        <SubgraphProvider chainIdOverwrite={chainId}>
          <ImpermaxRouterProvider>
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
                    'w-72'
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
                  <APYCard />
                  <FormCard />
                </div>
                <div className='w-72'>BalanceCard</div>
              </div>
            </div>
          </ImpermaxRouterProvider>
        </SubgraphProvider>
      </Layout>
    </Provider>
  );
};

export default Staking;
