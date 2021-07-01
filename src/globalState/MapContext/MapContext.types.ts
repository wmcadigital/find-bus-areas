export type MapState = {
  stopResults: any;
};

export type MapStateAction = {
  type: 'UPDATE_STOP_RESULTS';
  payload: any;
};

export type MapContext = [MapState, React.Dispatch<MapStateAction>];
