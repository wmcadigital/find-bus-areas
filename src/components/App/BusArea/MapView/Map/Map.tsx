import s from './Map.module.scss';

const Map = () => {
  return (
    <div className={`${s.mapView}`}>
      <div className={s.mapContainer}>Map</div>
    </div>
  );
};

export default Map;
