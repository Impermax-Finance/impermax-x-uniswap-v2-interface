import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import Routing from './Routing';
import './index.scss';

interface ViewProps {
  children: React.ReactNode;
}

function App() {
  return <div className="app">
    <Routing />
  </div>;
}

const wrapper = document.getElementById("impermax-app");
wrapper ? ReactDOM.render(<App />, wrapper) : false;