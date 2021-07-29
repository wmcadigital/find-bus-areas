// Using https://developers.arcgis.com/javascript/latest/api-reference/ and ESRI JS API
import { useRef, useEffect } from 'react';
import { useMapContext } from 'globalState';
import s from './Map.module.scss';
import './Map.scss';
// Import custom hooks for map functionality
import useCreateMapView from './customHooks/useCreateMapView';

const Map = () => {
  // MAP SETUP
  const mapContainerRef = useRef<any>();
  const [mapState, mapDispatch] = useMapContext();
  const view = useCreateMapView(mapContainerRef);

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
      if (visibleBusAreas.length > 0) {
        mapState.view.goTo(visibleBusAreas);
      }
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
