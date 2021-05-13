
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import LanguageProvider from 'contexts/LanguageProvider';
import NetworkProvider from 'contexts/NetworkProvider';
import App from './App';
import store from './state';
import reportWebVitals from './reportWebVitals';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <NetworkProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </NetworkProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
