/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { useEffect, useState, useCallback, useRef } from 'react';
// eslint-disable-next-line import/no-unresolved
import { loadModules, setDefaultOptions } from 'esri-loader';
// eslint-disable-next-line import/no-unresolved
import locateCircle from 'assets/svgs/map/locate-circle.svg';
import { useMapContext } from 'globalState';

const useCreateMapView = (mapContainerRef: any) => {
  const [viewState, setViewState] = useState<any>();
  const [isCreated, setIsCreated] = useState(false);

  const [mapState] = useMapContext();
  const busAreas = useRef<any>();
  busAreas.current = Object.keys(mapState.busAreas).map((key) => mapState.busAreas[key]);
  const createMapView = useCallback(async () => {
    try {
      setDefaultOptions({ css: true }); // Load esri css by default
      const [
        Map,
        MapView,
        Basemap,
        VectorTileLayer,
        Graphic,
        Locate,
        GraphicsLayer,
        Polygon,
        FeatureLayer,
      ] = await loadModules([
        'esri/Map',
        'esri/views/MapView',
        'esri/Basemap',
        'esri/layers/VectorTileLayer',
        'esri/Graphic',
        'esri/widgets/Locate',
        'esri/layers/GraphicsLayer',
        'esri/geometry/Polygon',
        'esri/layers/FeatureLayer',
      ]);

      const basemap = new Basemap({
        baseLayers: [
          new VectorTileLayer({
            id: 'wmca-basemap',
            portalItem: {
              // set the basemap to the one being used: https://tfwm.maps.arcgis.com/home/item.html?id=53f165a8863c4d40ba017042e248355e
              id: '53f165a8863c4d40ba017042e248355e',
            },
          }),
        ],
      });

      const view = new MapView({
        container: mapContainerRef.current,
        map: new Map({ basemap }),
        center: [-2.0047209, 52.4778132],
        zoom: 10,
      });

      // Create a locate button
      const locateBtn = new Locate({
        id: 'geolocation',
        view,
        popupEnabled: false,
        goToOverride: (e: any, { target }: { target: any }) => view.goTo(target.target),
        graphic: new Graphic({
          // overwrites the default symbol used for the graphic placed at the location of the user when found
          symbol: {
            type: 'picture-marker',
            url: locateCircle, // Set to svg circle when user hits 'locate' button
            height: '150px',
            width: '150px',
          },
        }),
      });

      // Move ui elements into the right position
      view.ui.move(['zoom'], 'top-right');
      view.ui.move(['attribution'], 'bottom');
      view.ui.add(locateBtn, { position: 'top-right' });

      // add bus area polygons
      busAreas.current.forEach((area: any) => {
        const polygon = new Polygon({
          rings: area.geometry.coordinates,
          spatialReference: { wkid: 4326 },
        });
        const graphic = new Graphic({
          geometry: polygon,
          symbol: {
            type: 'simple-fill',
            color: [0, 0, 0, 0],
            outline: {
              // autocasts as new SimpleLineSymbol()
              color: area.color,
              width: 2,
            },
          },
        });
        const gLayer = new GraphicsLayer({
          id: area.id,
          graphics: [graphic],
          objectIdField: 'oid', // This must be defined when creating a layer from `Graphic` objects
          visible: area.visible,
        });
        view.map.add(gLayer);
      });

      // const locationFeatureLayer = new FeatureLayer({
      //   id: 'stopsLayer',
      //   source: [],
      //   objectIdField: 'oid',
      //   fields: [
      //     {
      //       name: 'oid',
      //       alias: 'ObjectID',
      //       type: 'oid',
      //     },
      //     {
      //       name: 'name',
      //       alias: 'name',
      //       type: 'string',
      //     },
      //     {
      //       name: 'atcoCode',
      //       alias: 'atcoCode',
      //       type: 'string',
      //     },
      //     {
      //       name: 'busArea',
      //       alias: 'busArea',
      //       type: 'string',
      //     },
      //   ],
      //   renderer: {
      //     type: 'simple',
      //     symbol: {
      //       type: 'simple-marker',
      //       outline: { style: 'none', color: [0, 0, 0, 0] },
      //       color: [255, 20, 20, 1],
      //     },
      //   },
      // });
      // view.map.add(locationFeatureLayer);
      // view.map.reorder(locationFeatureLayer, 2);

      setViewState(view);
      setIsCreated(true);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }, [mapContainerRef, busAreas]);

  useEffect(() => {
    if (!isCreated) {
      createMapView();
    }

    return () => {
      if (!viewState) return;
      viewState!.destroy();
    };
  }, [createMapView, isCreated, viewState]);

  return viewState;
};

export default useCreateMapView;
