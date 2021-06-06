
import * as React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Web3ReactProvider } from '@web3-react/core';

import App from './App';
import getLibrary from 'utils/helpers/web3/get-library';
import LanguageProvider from 'contexts/LanguageProvider';
import NetworkProvider from 'contexts/NetworkProvider';
import { ImpermaxRouterProvider } from 'contexts/ImpermaxRouterProvider';
import { SubgraphProvider } from 'contexts/SubgraphProvider';
import Updater from 'store/transactions/updater';
import store from './store';
import reportWebVitals from './reportWebVitals';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={store}>
        <NetworkProvider>
          <LanguageProvider>
            <Updater />
            <SubgraphProvider>
              <ImpermaxRouterProvider>
                <Router>
                  <App />
                </Router>
              </ImpermaxRouterProvider>
            </SubgraphProvider>
          </LanguageProvider>
        </NetworkProvider>
      </Provider>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
