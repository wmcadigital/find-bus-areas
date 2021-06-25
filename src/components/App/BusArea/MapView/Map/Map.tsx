// Using https://developers.arcgis.com/javascript/latest/api-reference/ and ESRI JS API
import { useRef, useEffect, useCallback } from 'react';
import { loadModules } from 'esri-loader';
import s from './Map.module.scss';
// Import custom hooks for map functionality
import useCreateMapView from './customHooks/useCreateMapView';

const Map = () => {
  // MAP SETUP
  const mapContainerRef = useRef<any>();

  const view = useCreateMapView(mapContainerRef);
  const test = useCallback(async () => {
    try {
      const [Graphic] = await loadModules(['esri/Graphic']);

      if (view) {
        // First create a line geometry (this is the Keystone pipeline)
        const polyline = {
          type: 'polyline', // autocasts as new Polyline()
          paths: [
            [-111.3, 52.68],
            [-98, 49.5],
            [-93.94, 29.89],
          ],
        };

        // Create a symbol for drawing the line
        const lineSymbol = {
          type: 'simple-line', // autocasts as SimpleLineSymbol()
          color: [226, 119, 40],
          width: 4,
        };

        // Create an object for storing attributes related to the line
        const lineAtt = {
          Name: 'Keystone Pipeline',
          Owner: 'TransCanada',
          Length: '3,456 km',
        };

        /** *****************************************
         * Create a new graphic and add the geometry,
         * symbol, and attributes to it. You may also
         * add a simple PopupTemplate to the graphic.
         * This allows users to view the graphic's
         * attributes when it is clicked.
         ***************************************** */
        const polylineGraphic = new Graphic({
          geometry: polyline,
          symbol: lineSymbol,
          attributes: lineAtt,
          popupTemplate: {
            // autocasts as new PopupTemplate()
            title: '{Name}',
            content: [
              {
                type: 'fields',
                fieldInfos: [
                  {
                    fieldName: 'Name',
                  },
                  {
                    fieldName: 'Owner',
                  },
                  {
                    fieldName: 'Length',
                  },
                ],
              },
            ],
          },
        });

        view.graphics.add(polylineGraphic);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }, [view]);
  useEffect(() => {
    test();
  }, [test]);
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
