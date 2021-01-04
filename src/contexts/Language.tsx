import React, { createContext, useState } from "react";
import { Languages } from '../utils/languages';

export interface LanguageState {
   selected: Languages;
}

export function useContext() {
  const [state, dispatch] = useState<Partial<LanguageState>>({ selected: Languages.ENG });
  return { state, dispatch };
}

export interface LanguageContextI {
   state: Partial<LanguageState>;
   dispatch: Function;
}
export const LanguageContext = createContext<Partial<LanguageContextI>>({});

const LanguageProvider: React.FC = ({children}) => {

    const context = useContext();

    return <LanguageContext.Provider value={context}>{children}</LanguageContext.Provider>

}

export default LanguageProvider;