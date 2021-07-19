type BusArea = {
  [key: string]: {
    [key: string]: any;
  };
};

export type MapState = {
  view: any;
  stopResults: any;
  busAreas: BusArea;
  isStopsLayerCreated: boolean;
};

export type MapStateAction =
  | {
      type: 'ADD_VIEW';
      payload: any;
    }
  | {
      type: 'UPDATE_STOP_RESULTS';
      payload: any;
    }
  | {
      type: 'TOGGLE_AREA';
      payload: { name: string; value: boolean };
    }
  | {
      type: 'ADD_AREAS';
      payload: BusArea;
    }
  | {
      type: 'MOUNT_STOPS_LAYER';
      payload: boolean;
    };

export type MapContext = [MapState, React.Dispatch<MapStateAction>];
