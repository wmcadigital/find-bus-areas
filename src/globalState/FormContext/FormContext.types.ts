export type State = {
  mapView: boolean;
  ticketSearch: boolean;
  selectedStops: any[];
  showResult: boolean;
};

export type StateAction =
  | {
      type: 'UPDATE_SELECTED_STOPS';
      payload: any[];
    }
  | {
      type: 'ADD_STOP';
      payload: string;
    }
  | {
      type: 'SHOW_RESULT';
      payload: boolean;
    }
  | {
      type: 'CHANGE_VIEW';
      payload: boolean;
    };

export type Context = [State, React.Dispatch<StateAction>];
