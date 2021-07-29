// import { getSearchParam, setSearchParam } from '../helpers/URLSearchParams'; // (used to sync state with URL)
import * as TMap from './MapContext.types';

// Use an IIFE to define the initial state as we need to check session storage and query params
export const initialState = (() => {
  const state: TMap.MapState = {
    view: null,
    stopResults: {},
    busAreas: {},
    isStopsLayerCreated: false,
    isMapCleared: false,
  };

  return state;
})();

export const reducer = (state = initialState, action: TMap.MapStateAction): TMap.MapState => {
  switch (action.type) {
    case 'ADD_VIEW':
      return { ...state, view: action.payload };
    case 'UPDATE_STOP_RESULTS':
      return { ...state, stopResults: action.payload };
    case 'MOUNT_STOPS_LAYER':
      return { ...state, isStopsLayerCreated: action.payload };
    case 'ADD_AREAS':
      return { ...state, busAreas: action.payload };
    case 'RESET_FORM':
      return { ...state, isMapCleared: action.payload };
    case 'TOGGLE_AREA':
      return {
        ...state,
        busAreas: {
          ...state.busAreas,
          [action.payload.name]: {
            ...state.busAreas[action.payload.name],
            visible: action.payload.value,
          },
        },
      };
    // Default should return initial state if error
    default:
      return initialState;
  }
};
