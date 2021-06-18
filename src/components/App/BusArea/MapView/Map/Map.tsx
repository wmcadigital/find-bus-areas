// Using https://developers.arcgis.com/javascript/latest/api-reference/ and ESRI JS API
import { useRef } from 'react';
import s from './Map.module.scss';
// Import custom hooks for map functionality
import useCreateMapView from './customHooks/useCreateMapView';

const Map = () => {
  // MAP SETUP
  const mapContainerRef = useRef<any>();

  useCreateMapView(mapContainerRef);
  return (
    <div className={`${s.mapView}`}>
      <div
        id="disruptions-map"
        className={`${s.mapContainer} webmap disruptions-esri-map`}
        ref={mapContainerRef}
        title="Disruptions map"
      />
    </div>
  );
};

export default Map;
