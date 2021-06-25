import { useReducer, createContext, useContext } from 'react';
import * as TMap from './MapContext.types';
import { initialState, reducer } from './MapContext.reducer';

const MapContext = createContext<Partial<TMap.MapContext>>([]);

// eslint-disable-next-line react/prop-types
export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Set up reducer using reducer logic and initialState by default
  const [formState, formDispatch] = useReducer(reducer, initialState);
  return <MapContext.Provider value={[formState, formDispatch]}>{children}</MapContext.Provider>;
};

export const useMapContext = () => useContext(MapContext) as TMap.MapContext;
