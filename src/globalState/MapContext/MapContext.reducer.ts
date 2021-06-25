// import { getSearchParam, setSearchParam } from '../helpers/URLSearchParams'; // (used to sync state with URL)
import * as TMap from './MapContext.types';

// Use an IIFE to define the initial state as we need to check session storage and query params
export const initialState = (() => {
  const state: TMap.MapState = {
    stopResults: [],
  };

  return state;
})();

export const reducer = (state = initialState, action: TMap.MapStateAction): TMap.MapState => {
  switch (action.type) {
    case 'UPDATE_STOP_RESULTS':
      return { ...state, stopResults: action.payload };

    // Default should return initial state if error
    default:
      return initialState;
  }
};
