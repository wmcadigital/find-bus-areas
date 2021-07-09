/* eslint-disable @typescript-eslint/no-unused-vars */
// Using https://developers.arcgis.com/javascript/latest/api-reference/ and ESRI JS API
import { useRef, useEffect, useCallback } from 'react';
import { loadModules } from 'esri-loader';
import { useMapContext } from 'globalState';
import s from './Map.module.scss';
// Import custom hooks for map functionality
import useCreateMapView from './customHooks/useCreateMapView';

const Map = () => {
  // MAP SETUP
  const mapContainerRef = useRef<any>();
  const [, mapDispatch] = useMapContext();
  const view = useCreateMapView(mapContainerRef);
  const test = useCallback(async () => {
    try {
      if (view) {
        mapDispatch({ type: 'ADD_VIEW', payload: view });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }, [view, mapDispatch]);

  useEffect(() => {
    test();
  }, [test]);

  return (
    <div className={`${s.mapView}`}>
      <div
        id="bus-areas-map"
        className={`${s.mapContainer} webmap busAreas-esri-map`}
        ref={mapContainerRef}
        title="Bus areas map"
      />
    </div>
  );
};

export default Map;
