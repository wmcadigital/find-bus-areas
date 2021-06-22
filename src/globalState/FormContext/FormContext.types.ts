export type State = {
  mapView: boolean;
  ticketSearch: boolean;
  selectedStops: any[];
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
      type: 'CHANGE_VIEW';
      payload: boolean;
    };

export type Context = [State, React.Dispatch<StateAction>];
