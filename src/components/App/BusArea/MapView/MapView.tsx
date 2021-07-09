import { useEffect } from 'react';
import { useMapContext } from 'globalState';
import BusStopSearch from 'components/shared/BusStopSearch/BusStopSearch';
import { NZoneAreas, NZoneColours } from 'components/App/NZoneAreas/NZoneAreas';
import Map from './Map/Map';
import s from './MapView.module.scss';

const MapView = () => {
  const [, mapDispatch] = useMapContext();
  useEffect(() => {
    const payload: { [key: string]: any } = {};
    NZoneAreas.features.forEach((area) => {
      payload[area.properties.area_name] = {
        id: area.properties.area_name.replace(/\W/g, '_'),
        color: NZoneColours[area.properties.area_name],
        visible: true,
        ...area,
      };
    });
    mapDispatch({ type: 'ADD_AREAS', payload });
  }, [mapDispatch]);
  return (
    <div className={s.mapViewSection}>
      <div className={`${s.container} wmnds-grid wmnds-grid--spacing-md-2-lg`}>
        <div className="wmnds-col-1-1 wmnds-col-md-1-2 wmnds-col-lg-1-3">
          <div className="bg-white wmnds-p-md">
            <BusStopSearch />
          </div>
        </div>
        <div className="wmnds-col-1-1 wmnds-col-md-1-2 wmnds-col-lg-2-3">
          <Map />
        </div>
      </div>
    </div>
  );
};

export default MapView;
