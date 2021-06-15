import { useReducer, createContext, useContext } from 'react';
import * as TForm from './FormContext.types';
import { initialState, reducer } from './FormContext.reducer';

const FormContext = createContext<Partial<TForm.Context>>([]);

// eslint-disable-next-line react/prop-types
export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Set up reducer using reducer logic and initialState by default
  const [formState, formDispatch] = useReducer(reducer, initialState);
  return <FormContext.Provider value={[formState, formDispatch]}>{children}</FormContext.Provider>;
};

export const useFormContext = () => useContext(FormContext) as TForm.Context;
