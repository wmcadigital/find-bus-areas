import { useCallback, useState } from 'react';
import { useMapContext, useFormContext } from 'globalState';

// eslint-disable-next-line import/no-unresolved

import { loadModules } from 'esri-loader';
// import mapMarker from 'assets/svgs/map/map-marker.svg';

const useUpdateStopsLayer = () => {
  const [{ view }, mapDispatch] = useMapContext();
  const [{ selectedStops }] = useFormContext();
  const [selectedResult, setSelectedResult] = useState<any>(null);

  const updateMapStops = useCallback(
    async (id: any, stopResults?: any) => {
      try {
        const [Graphic] = await loadModules(['esri/Graphic']);
        const busStopsLayer = await view.map.findLayerById(id);

        const applyEditsToLayer = (edits: any) => {
          busStopsLayer
            .applyEdits(edits)
            .then((res: any) => {
              // if edits were removed
              if (res.deleteFeatureResults.length > 0) {
                console.log(res.deleteFeatureResults.length, 'features have been removed');
              }

              // if features were added - call queryFeatures to return
              // newly added graphics
              if (res.addFeatureResults.length > 0) {
                const objectIds: any = [];
                res.addFeatureResults.forEach((item: any) => {
                  objectIds.push(item.objectId);
                });
                // query the newly added features from the layer
                const stopsQuery = busStopsLayer.createQuery();
                stopsQuery.returnGeometry = true;
                busStopsLayer
                  .queryFeatures(stopsQuery, {
                    objectIds,
                  })
                  .then((results: any) => {
                    console.log(results.features.length, 'features have been added.');
                    if (results.features.length) {
                      view.goTo(results.features);
                    }
                  });
              }
            })
            .catch((error: any) => {
              // eslint-disable-next-line no-console
              console.log(error);
            });
        };

        if (view && stopResults) {
          const selectedStop = selectedStops.find(
            (stop: any) => stop.autoCompleteId === id && stop.properties
          );
          const graphicsToAdd = [...(!selectedStop ? stopResults : [selectedStop])];

          const graphics = graphicsToAdd.map((graphic: any) => {
            return new Graphic({
              attributes: {
                name: graphic.properties.name,
                atcoCode: graphic.properties.atcoCode,
                busArea: graphic.stopBusAreas[0],
              },
              geometry: {
                type: 'point',
                longitude: graphic.geometry.coordinates[0],
                latitude: graphic.geometry.coordinates[1],
                spatialreference: {
                  wkid: 4326,
                },
              },
            });
          });

          view.popup.visibleElements = {
            featureNavigation: false,
          };
          view.popup.dockEnabled = false;
          view.popup.dockOptions = { buttonEnabled: false };

          view.popup.on('trigger-action', (event: any) => {
            if (event.action.id === 'add-stop') {
              const result = stopResults.find(
                (res: any) => res.properties.name === view.popup.selectedFeature.attributes.name
              );

              setSelectedResult(result);
              // reset stop results
              mapDispatch({
                type: 'UPDATE_STOP_RESULTS',
                payload: {},
              });
              if (busStopsLayer && result) {
                busStopsLayer.queryFeatures().then((results: any) => {
                  // edits object tells apply edits that you want to delete the features
                  // filter out the results that have been selected
                  const selectedStopNames = selectedStops.map((stop) => stop.properties?.name);
                  const graphicsToRemove = results.features.filter(
                    (r: any) => !selectedStopNames.includes(r.attributes.name)
                  );
                  const deleteEdits = {
                    deleteFeatures: graphicsToRemove,
                  };
                  // apply edits to the layer
                  applyEditsToLayer(deleteEdits);
                });
              }
            }
            view.popup.close();
          });

          if (busStopsLayer) {
            busStopsLayer.queryFeatures().then((results: any) => {
              const graphicsToRemove = results.features;
              const edits = {
                addFeatures: graphics,
                deleteFeatures: graphicsToRemove,
              };
              console.log(edits);
              // apply edits to the layer
              applyEditsToLayer(edits);
            });
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    },
    [view, selectedStops, mapDispatch]
  );

  return { updateMapStops, selectedResult };
};

export default useUpdateStopsLayer;
