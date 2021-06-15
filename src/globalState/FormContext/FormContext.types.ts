export type State = {
  mounted: boolean;
  mapView: boolean;
  ticketSearch: boolean;
};

export type StateAction =
  | {
      type: 'MOUNT_APP';
    }
  | {
      type: 'CHANGE_VIEW';
      payload: boolean;
    };

export type Context = [State, React.Dispatch<StateAction>];
