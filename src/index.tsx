import React from 'react';
import ReactDOM from 'react-dom';
import Routing from './Routing';
import './index.scss';

function App() {
  return <div className="app">
    <Routing />
  </div>;
}

const wrapper = document.getElementById("impermax-app");
wrapper ? ReactDOM.render(<App />, wrapper) : false;