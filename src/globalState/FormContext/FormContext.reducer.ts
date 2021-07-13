import { getSearchParam, setSearchParam } from '../helpers/URLSearchParams'; // (used to sync state with URL)
import * as TForm from './FormContext.types';

// Use an IIFE to define the initial state as we need to check session storage and query params
export const initialState = (() => {
  const state: TForm.State = {
    ticketSearch: !!getSearchParam('ticketSearch'),
    mapView: getSearchParam('mapView') === 'true',
    selectedStops: [],
    showResult: false,
  };

  return state;
})();

export const reducer = (state = initialState, action: TForm.StateAction): TForm.State => {
  switch (action.type) {
    case 'CHANGE_VIEW':
      setSearchParam('mapView', `${action.payload}`);
      return { ...state, mapView: action.payload };
    case 'UPDATE_SELECTED_STOPS':
      return { ...state, selectedStops: action.payload };
    case 'SHOW_RESULT':
      return { ...state, showResult: action.payload };
    case 'ADD_STOP':
      return {
        ...state,
        selectedStops: [...state.selectedStops, { autoCompleteId: action.payload }],
      };

    // Default should return initial state if error
    default:
      return initialState;
  }
};
