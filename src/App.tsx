import React from 'react';
import Routing from './Routing';
import { UseWalletProvider } from 'use-wallet';
import { Language, Theme, Web3Provider } from './contexts';
import './index.scss';
import Network from './contexts/Network';
import { useChainId } from './hooks/useNetwork';
import { ImpermaxRouterProvider } from './contexts/ImpermaxRouterProvider';
import { Provider } from 'react-redux';
import store from './state';
import Updaters from './state/Updaters';
import { SubgraphProvider } from './contexts/SubgraphProvider';

/**
 * Wrapper to connect all application Contexts.
 * @param param0 ReactProps
 */

const Contexts: React.FC = ({ children }) => {
  return (
    <Provider store={store}>
      <Network>
        <Language>
          <Theme>
            <UseWalletProvider chainId={useChainId()}>
              <Web3Provider>
                <Updaters />
                <SubgraphProvider>
                  <ImpermaxRouterProvider>
                    {children}
                  </ImpermaxRouterProvider>
                </SubgraphProvider>
              </Web3Provider>
            </UseWalletProvider>
          </Theme>
        </Language>
      </Network>
    </Provider>
  );
};

function App(): JSX.Element {
  return (
    <div className='app'>
      <Contexts>
        <Routing />
      </Contexts>
    </div>
  );
}

export default App;
