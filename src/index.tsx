import React from 'react';
import ReactDOM from 'react-dom';
import Routing from './Routing';
import { Language, Theme } from './contexts';
import './index.scss';

function App() {
  return <div className="app">
    <Contexts>
      <Routing />
    </Contexts>
  </div>;
}

const Contexts: React.FC = ({ children }) => {
  return <Language>
    <Theme>
      { children }
    </Theme>
  </Language>
}

const wrapper = document.getElementById("impermax-app");
wrapper ? ReactDOM.render(<App />, wrapper) : false;