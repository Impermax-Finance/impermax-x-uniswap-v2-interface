import React from 'react';
import ReactDOM from 'react-dom';
import Routing from './Routing';
import { useWallet, UseWalletProvider } from 'use-wallet';
import { Language, Theme, Web3Provider } from './contexts';
import './index.scss';
import Network from './contexts/Network';
import { useChainId } from './hooks/useNetwork';
import { ImpermaxRouterProvider } from './contexts/ImpermaxRouterProvider';
import { Provider } from 'react-redux';
import store from './state';

function App() {
  return <div className="app">
    <Contexts>
      <Routing />
    </Contexts>
  </div>;
}

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
                <ImpermaxRouterProvider>
                  { children }
                </ImpermaxRouterProvider>
              </Web3Provider>
            </UseWalletProvider>
          </Theme>
        </Language>
      </Network>
    </Provider>
  );
}

const wrapper = document.getElementById("impermax-app");
wrapper ? ReactDOM.render(<App />, wrapper) : false;