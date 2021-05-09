import React, { createContext, useState } from 'react';
import { Languages } from '../utils/languages';

const LanguageProvider: React.FC = ({ children }) => {
  const context = useContext();
  return <LanguageContext.Provider value={context}>{children}</LanguageContext.Provider>;
};

export interface LanguageState {
  selected: Languages;
}

export function useContext() {
  const [state, dispatch] = useState<Partial<LanguageState>>({ selected: Languages.ENG });
  return { state, dispatch };
}

export interface LanguageContextI {
  state: Partial<LanguageState>;
  // eslint-disable-next-line @typescript-eslint/ban-types
  dispatch: Function;
}
export const LanguageContext = createContext<Partial<LanguageContextI>>({});

export default LanguageProvider;
