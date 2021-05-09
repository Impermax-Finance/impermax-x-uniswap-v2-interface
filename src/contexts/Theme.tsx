import React, { createContext, useState } from 'react';

const theme = {
  buttons: {
    color: {
      primary: '#000000'
    }
  }
};

export function useContext() {
  const [state, dispatch] = useState(theme);
  return { state, dispatch };
}

export const ThemeContext = createContext({});

export const ThemeProvider: React.FC = ({ children }) => {
  const context = useContext();

  return <ThemeContext.Provider value={context}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
