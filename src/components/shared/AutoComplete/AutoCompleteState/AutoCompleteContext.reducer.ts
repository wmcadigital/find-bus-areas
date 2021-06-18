import * as TAutoComplete from './AutoCompleteContext.types';

// Use an IIFE to define the initial state as we need to check session storage and query params
export const initialState = (() => {
  const state: TAutoComplete.State = {
    mounted: false,
    query: '',
    selectedItem: null,
  };

  return state;
})();

export const reducer = (
  state = initialState,
  action: TAutoComplete.StateAction
): TAutoComplete.State => {
  switch (action.type) {
    case 'MOUNT_COMPONENT':
      return { ...state, mounted: action.payload };

    case 'UPDATE_QUERY':
      return { ...state, query: action.payload };

    case 'UPDATE_SELECTED_ITEM':
      return { ...state, selectedItem: action.payload };

    case 'REMOVE_SELECTED_ITEM':
      return { ...state, query: '', selectedItem: null };

    // Default should return initial state if error
    default:
      return initialState;
  }
};
