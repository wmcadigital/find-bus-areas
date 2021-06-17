export type State = {
  query: string;
  selectedItem: any;
};

export type StateAction =
  | {
      type: 'UPDATE_QUERY';
      payload: string;
    }
  | {
      type: 'UPDATE_SELECTED_ITEM';
      payload: any;
    };

export type Context = [State, React.Dispatch<StateAction>];
