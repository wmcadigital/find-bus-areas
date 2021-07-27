/* eslint-disable @typescript-eslint/no-unused-vars */
// Using https://developers.arcgis.com/javascript/latest/api-reference/ and ESRI JS API
import { useRef, useEffect, useCallback } from 'react';
import { loadModules } from 'esri-loader';
import { useMapContext } from 'globalState';
import s from './Map.module.scss';
import './Map.scss';
// Import custom hooks for map functionality
import useCreateMapView from './customHooks/useCreateMapView';
import useCreateStopsLayer from './customHooks/useCreateStopsLayer';

const Map = () => {
  // MAP SETUP
  const mapContainerRef = useRef<any>();
  const [mapState, mapDispatch] = useMapContext();
  const view = useCreateMapView(mapContainerRef);
  const isStopsLayerCreated = useCreateStopsLayer(view);

  useEffect(() => {
    if (view) {
      mapDispatch({ type: 'ADD_VIEW', payload: view });
    }
    return () => {
      mapDispatch({ type: 'ADD_VIEW', payload: null });
    };
  }, [view, mapDispatch]);

  useEffect(() => {
    const busAreasArray = Object.keys(mapState.busAreas).map((key) => mapState.busAreas[key]);
    if (mapState.view?.map) {
      busAreasArray.forEach((area) => {
        mapState.view.map.findLayerById(area.id).visible = area.visible;
      });
      const visibleBusAreas = busAreasArray
        .filter((area: any) => area.visible)
        .map((area: any) => area.geometry.coordinates);
      if (visibleBusAreas.length > 0) mapState.view.goTo(visibleBusAreas);
    }
  }, [mapState.view, mapState.busAreas]);

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
