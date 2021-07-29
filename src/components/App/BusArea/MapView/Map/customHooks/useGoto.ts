import { useEffect, useState, useCallback } from 'react';
import { loadModules } from 'esri-loader';
import { useMapContext } from 'globalState';
import mapMarker from 'assets/svgs/map/map-marker.svg';

const useCreateStopsLayer = (view: any) => {
  const [isCreated, setIsCreated] = useState(false);
  const map = view !== null && view?.map;

  const [{ stopResults }, mapDispatch] = useMapContext();

  const createStopsLayer = useCallback(async () => {
    try {
      if (!stopResults?.nearestStops) return;
      const [FeatureLayer] = await loadModules(['esri/layers/FeatureLayer']);

      const busStopGraphics: any = [];
      stopResults?.nearestStops.forEach((result: any) => {
        const graphic = {
          attributes: {
            name: result.properties.name,
            atcoCode: result.properties.atcoCode,
            busArea: result.stopBusAreas[0],
          },
          geometry: {
            type: 'point',
            longitude: result.geometry.coordinates[0],
            latitude: result.geometry.coordinates[1],
            spatialreference: {
              wkid: 4326,
            },
          },
        };
        busStopGraphics.push(graphic);
      });

      const stopsLayer = new FeatureLayer({
        id: 'busStopsLayer',
        title: 'Nearest stops',
        source: busStopGraphics, // autocast as a Collection of new Graphic()
        objectIdField: 'oid',
        fields: [
          {
            name: 'oid',
            alias: 'ObjectID',
            type: 'oid',
          },
          {
            name: 'name',
            alias: 'name',
            type: 'string',
          },
          {
            name: 'atcoCode',
            alias: 'atcoCode',
            type: 'string',
          },
          {
            name: 'busArea',
            alias: 'busArea',
            type: 'string',
          },
        ],
        renderer: {
          type: 'simple',
          symbol: {
            type: 'picture-marker',
            url: mapMarker,
            width: 24,
            height: 24,
          },
        },
      });

      const popup = {
        featureCount: 10,
        actions: [
          {
            title: '{name}',
            id: 'add-stop',
            image: mapMarker,
            className: 'esri-add-stop',
          },
        ],
      };

      stopsLayer.popupTemplate = popup;
      map.add(stopsLayer);

      map.reorder(stopsLayer, 5);
      setIsCreated(true);
      mapDispatch({ type: 'MOUNT_STOPS_LAYER', payload: true });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }, [stopResults, map, mapDispatch]);

  useEffect(() => {
    if (isCreated || !map) return;
    createStopsLayer();
  }, [isCreated, createStopsLayer, map]);

  useEffect(() => {
    return () => {
      mapDispatch({ type: 'MOUNT_STOPS_LAYER', payload: false });
    };
  }, [mapDispatch]);

  return isCreated;
};

export default useCreateStopsLayer;
