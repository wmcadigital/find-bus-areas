import { getSearchParam, setSearchParam } from '../helpers/URLSearchParams'; // (used to sync state with URL)
import * as TForm from './FormContext.types';

// Use an IIFE to define the initial state as we need to check session storage and query params
export const initialState = (() => {
  const state: TForm.State = {
    mounted: false,
    ticketSearch: !!getSearchParam('ticketSearch'),
    mapView: !!getSearchParam('mapView'),
  };

  return state;
})();

export const reducer = (state = initialState, action: TForm.StateAction): TForm.State => {
  switch (action.type) {
    case 'MOUNT_APP':
      return { ...state, mounted: true };

    case 'CHANGE_VIEW':
      setSearchParam('mapView', `${action.payload}`);
      return { ...state, mapView: action.payload };

    // Default should return initial state if error
    default:
      return initialState;
  }
};
