export type State = {
  mounted: boolean;
  query: string;
  selectedItem: any;
};

export type StateAction =
  | {
      type: 'MOUNT_COMPONENT';
      payload: boolean;
    }
  | {
      type: 'UPDATE_QUERY';
      payload: string;
    }
  | {
      type: 'UPDATE_SELECTED_ITEM';
      payload: any;
    }
  | {
      type: 'REMOVE_SELECTED_ITEM';
    };

export type Context = [State, React.Dispatch<StateAction>];
