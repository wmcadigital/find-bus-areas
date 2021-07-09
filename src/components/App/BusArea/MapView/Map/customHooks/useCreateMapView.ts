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
        GeoJSONLayer,
        Graphic,
        Locate,
        GraphicsLayer,
        Polygon,
      ] = await loadModules([
        'esri/Map',
        'esri/views/MapView',
        'esri/Basemap',
        'esri/layers/VectorTileLayer',
        'esri/layers/GeoJSONLayer',
        'esri/Graphic',
        'esri/widgets/Locate',
        'esri/layers/GraphicsLayer',
        'esri/geometry/Polygon',
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

      // const locationGraphicsLayer = new GraphicsLayer({ id: 'location' });
      // view.map.add(locationGraphicsLayer);
      // view.map.reorder(locationGraphicsLayer, 0);

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

      // const geoJSONLayer = new GeoJSONLayer({
      //   url: 'https://opendata.arcgis.com/datasets/6fa00c6e68704bd08ba53f2d0ba34d4b_7.geojson',
      //   copyright: 'Transport for West Midlands',
      // });
      // view.map.add(geoJSONLayer);

      // const renderer = {
      //   type: 'simple', // autocasts as new SimpleRenderer()
      //   symbol: {
      //     type: 'simple-line',
      //     size: 6,
      //     width: 3,
      //     color: '#c96c08',
      //   },
      // };

      // const layer = new FeatureLayer({
      //   // URL to the service
      //   url: 'https://utility.arcgis.com/usrsvcs/servers/6fa00c6e68704bd08ba53f2d0ba34d4b/rest/services/Hosted/wmca_bus/FeatureServer/7',
      //   renderer,
      // });

      // view.whenLayerView(layer).then((layerView: any) => {
      //   layerView.watch('updating', (val: any) => {
      //     if (!val) {
      //       // wait for the layer view to finish updating
      //       layerView
      //         .queryFeatures({
      //           geometry: view.extent,
      //           returnGeometry: true,
      //         })
      //         .then((results: any) => {
      //           console.log(results.features); // prints all the client-side features to the console
      //         });
      //     }
      //   });
      // });

      // view.map.add(layer);

      // const locationFeatureLayer = new FeatureLayer({ id: 'featureTest' });
      // view.map.add(locationFeatureLayer);
      // view.map.reorder(locationFeatureLayer, 2);

      const stopResults = [
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [-1.85714, 52.514229] },
          properties: {
            name: 'Gravelly Hill, George Rd (opp)',
            atcoCode: '43000503202',
            type: 'bus-stop',
            stopInfo: '/Stop/v2/Point/43000503202',
            departures: '/Stop/v2/Departures/43000503202',
          },
        },
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [-1.855953, 52.516591] },
          properties: {
            name: 'Gravelly Hill, St Thomas Rd (adjacent)',
            atcoCode: '43000503301',
            type: 'bus-stop',
            stopInfo: '/Stop/v2/Point/43000503301',
            departures: '/Stop/v2/Departures/43000503301',
          },
        },
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [-1.856304, 52.517284] },
          properties: {
            name: 'Gravelly Hill, St Thomas Rd (opposite)',
            atcoCode: '43000503302',
            type: 'bus-stop',
            stopInfo: '/Stop/v2/Point/43000503302',
            departures: '/Stop/v2/Departures/43000503302',
          },
        },
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [-1.856903, 52.518984] },
          properties: {
            name: 'Stockland Green, Victoria Rd (adj)',
            atcoCode: '43000503401',
            type: 'bus-stop',
            stopInfo: '/Stop/v2/Point/43000503401',
            departures: '/Stop/v2/Departures/43000503401',
          },
        },
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [-1.85715, 52.520099] },
          properties: {
            name: 'Stockland Green, Victoria Rd (opp)',
            atcoCode: '43000503402',
            type: 'bus-stop',
            stopInfo: '/Stop/v2/Point/43000503402',
            departures: '/Stop/v2/Departures/43000503402',
          },
        },
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [-1.858029, 52.521691] },
          properties: {
            name: 'Stockland Green, Frances Rd (adj)',
            atcoCode: '43000503501',
            type: 'bus-stop',
            stopInfo: '/Stop/v2/Point/43000503501',
            departures: '/Stop/v2/Departures/43000503501',
          },
        },
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [-1.858058, 52.521988] },
          properties: {
            name: 'Stockland Green, Frances Rd (opp)',
            atcoCode: '43000503502',
            type: 'bus-stop',
            stopInfo: '/Stop/v2/Point/43000503502',
            departures: '/Stop/v2/Departures/43000503502',
          },
        },
      ];

      const stopData = stopResults.map((result: any) => {
        return new Graphic({
          attributes: {
            name: result.properties.name,
            atcoCode: result.properties.atcoCode,
            // whatever else you'll need - then reference in the 'fields' property below
          },
          geometry: {
            type: 'point',
            longitude: result.geometry.coordinates[0] || -1.8960335,
            latitude: result.geometry.coordinates[1] || 52.481755,
            spatialreference: {
              wkid: 4326,
            },
          },
          symbol: {
            type: 'text', // autocasts as new TextSymbol()
            color: 'white',
            backgroundColor: '#000',
            haloColor: 'black',
            haloSize: '15px',
            text: result.properties.name,
            xoffset: 3,
            yoffset: 3,
            font: {
              // autocasts as new Font()
              size: 12,
              family: 'Noto Sans Bold',
              weight: 'bold',
            },
          },
        });
      });

      const testLayer = new GraphicsLayer({
        id: 'busStops',
        source: stopData,
        objectIdField: 'oid', // This must be defined when creating a layer from `Graphic` objects
        fields: [
          {
            name: 'oid',
            alias: 'oid',
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
        ],
        renderer: {
          // overrides the layer's default renderer type: "simple",
          type: 'text', // autocasts as new SimpleRenderer()
        },
      });

      view.map.add(testLayer);
      view.map.reorder(testLayer, 2);

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
