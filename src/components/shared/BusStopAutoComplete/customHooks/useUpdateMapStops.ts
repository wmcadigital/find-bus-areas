import { useCallback, useState } from 'react';
import { useMapContext, useFormContext } from 'globalState';

// eslint-disable-next-line import/no-unresolved

import { loadModules } from 'esri-loader';
// import mapMarker from 'assets/svgs/map/map-marker.svg';

const useUpdateMapStops = () => {
  const [{ view }] = useMapContext();
  const [{ selectedStops }] = useFormContext();
  const [selectedResult, setSelectedResult] = useState<any>(null);

  const updateMapStops = useCallback(
    async (stopResults: any) => {
      try {
        const [Graphic] = await loadModules(['esri/Graphic']);
        if (view) {
          const graphics: any = [];
          const graphicsToAdd = [...stopResults, ...selectedStops];

          graphicsToAdd.forEach((result: any) => {
            const nearestStopGraphics = new Graphic({
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
            });
            graphics.push(nearestStopGraphics);
          });

          const busStopsLayer = await view.map.findLayerById('busStopsLayer');

          const applyEditsToLayer = (edits: any) => {
            busStopsLayer
              .applyEdits(edits)
              .then((res: any) => {
                // if edits were removed
                if (res.deleteFeatureResults.length > 0) {
                  console.log(res.deleteFeatureResults.length, 'features have been removed');
                }
                // if features were added - call queryFeatures to return
                //    newly added graphics
                if (res.addFeatureResults.length > 0) {
                  const objectIds: any = [];
                  res.addFeatureResults.forEach((item: any) => {
                    objectIds.push(item.objectId);
                  });
                  const stopsQuery = busStopsLayer.createQuery();
                  stopsQuery.returnGeometry = true;
                  // query the newly added features from the layer
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
                console.log(error);
              });
          };

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
              if (busStopsLayer && result) {
                busStopsLayer.queryFeatures().then((results: any) => {
                  // edits object tells apply edits that you want to delete the features
                  // filter out the results that have been selected
                  const selectedStopNames = selectedStops.map((stop) => stop.properties.name);
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
            const edits = {
              addFeatures: graphics,
            };
            applyEditsToLayer(edits);
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    },
    [view, selectedStops]
  );

  return { updateMapStops, selectedResult };
};

export default useUpdateMapStops;
