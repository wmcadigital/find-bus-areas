import { useEffect, useState, useCallback } from 'react';
import { loadModules } from 'esri-loader';
import { useMapContext, useFormContext } from 'globalState';
import mapMarker from 'assets/svgs/map/map-marker.svg';

const useCreateStopsLayer = (view: any, autoCompleteId: string) => {
  const [isStopsLayerCreated, setIsStopsLayerCreated] = useState(false);
  const map = view !== null && view?.map;

  const [{ selectedStops }] = useFormContext();
  const [{ stopResults }] = useMapContext();

  const createStopsLayer = useCallback(async () => {
    try {
      const selectedStop = selectedStops.find(
        (stop: any) => stop.autoCompleteId === autoCompleteId && stop.properties
      );
      if (!stopResults?.nearestStops && !selectedStop) return;
      const [FeatureLayer] = await loadModules(['esri/layers/FeatureLayer']);

      const graphicsToAdd = [...(!selectedStop ? stopResults?.nearestStops : [selectedStop])];

      const busStopGraphics = graphicsToAdd.map((result: any) => {
        return {
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
      });

      const stopsLayer = new FeatureLayer({
        id: autoCompleteId,
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
      setIsStopsLayerCreated(true);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }, [stopResults, map, autoCompleteId]);

  useEffect(() => {
    if (isStopsLayerCreated || !map) return;
    createStopsLayer();
  }, [isStopsLayerCreated, createStopsLayer, map]);

  return { isStopsLayerCreated, setIsStopsLayerCreated };
};

export default useCreateStopsLayer;
