export type State = {
  mapView: boolean;
  ticketSearch: boolean;
  selectedStops: any[];
};

export type StateAction =
  | {
      type: 'ADD_SELECTED_STOP';
      payload: any[];
    }
  | {
      type: 'CHANGE_VIEW';
      payload: boolean;
    };

export type Context = [State, React.Dispatch<StateAction>];
