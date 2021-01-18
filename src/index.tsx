import React from 'react';
import ReactDOM from 'react-dom';
import Routing from './Routing';
import { useWallet, UseWalletProvider } from 'use-wallet';
import { Language, Theme } from './contexts';
import './index.scss';
import { chainDetailsMap, Networks } from './utils/connections';

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
  const chain = chainDetailsMap;
  const network = chain[process.env.NETWORK as Networks].networkId;
  return (<UseWalletProvider chainId={network}>
    <Language>
      <Theme>
        { children }
      </Theme>
    </Language>
  </UseWalletProvider>);
}

const wrapper = document.getElementById("impermax-app");
wrapper ? ReactDOM.render(<App />, wrapper) : false;