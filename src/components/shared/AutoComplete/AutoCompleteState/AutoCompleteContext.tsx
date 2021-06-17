import { useReducer, createContext, useContext } from 'react';
import * as TAutoComplete from './AutoCompleteContext.types';
import { initialState, reducer } from './AutoCompleteContext.reducer';

const AutoCompleteContext = createContext<Partial<TAutoComplete.Context>>([]);

// eslint-disable-next-line react/prop-types
export const AutoCompleteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Set up reducer using reducer logic and initialState by default
  const [autoCompleteState, autoCompleteDispatch] = useReducer(reducer, initialState);
  return (
    <AutoCompleteContext.Provider value={[autoCompleteState, autoCompleteDispatch]}>
      {children}
    </AutoCompleteContext.Provider>
  );
};

export const useAutoCompleteContext = () =>
  useContext(AutoCompleteContext) as TAutoComplete.Context;
