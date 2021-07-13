/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
// Import context
import { useFormContext, useMapContext } from 'globalState';
// eslint-disable-next-line import/no-unresolved

import { loadModules } from 'esri-loader';
import locationMarker from 'assets/svgs/map/locate-circle.svg';
import mapMarker from 'assets/svgs/map/map-marker.svg';

// Import components
import AutoComplete from 'components/shared/AutoComplete/AutoComplete';
import Button from 'components/shared/Button/Button';
import Icon from 'components/shared/Icon/Icon';
import Message from 'components/shared/Message/Message';
import Loader from 'components/shared/Loader/Loader';
// Import custom hooks
import useLocationAPI from './customHooks/useLocationAPI';
import useBusStopAPI from './customHooks/useBusStopAPI';
import useBusStopSelect from './customHooks/useBusStopSelect';

const BusStopAutoComplete = ({ id, label, name }: { id: string; label?: string; name: string }) => {
  const [{ mapView, selectedStops }, formDispatch] = useFormContext();
  const [{ view, busAreas }, mapDispatch] = useMapContext();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState<any>();
  const { onBusStopSelect } = useBusStopSelect();
  const selectedItem = selectedStops.find((stop) => stop.autoCompleteId === id);
  // eslint-disable-next-line prettier/prettier
  const {
    results: locationResults,
    loading,
    errorInfo,
    getAPIResults,
  } = useLocationAPI(
    `/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?singleLine=${encodeURI(
      query.toLowerCase()
    )}&f=pjson`
  );
  const {
    results: stopResults,
    loading: stopsLoading,
    getAPIResults: getStopAPIResults,
    errorInfo: stopErrorInfo,
  } = useBusStopAPI();

  const addStopsToMap = useCallback(async () => {
    try {
      const [Graphic, GraphicsLayer, FeatureLayer] = await loadModules([
        'esri/Graphic',
        'esri/layers/GraphicsLayer',
        'esri/layers/FeatureLayer',
      ]);
      if (view) {
        const features: any = [];
        const nameValues: any = [];
        const resultsToShow = stopResults.map((res: any) => {
          const newResult = res;
          newResult.properties.name = res.properties.name.replace(/ *\([^)]*\) */g, '');
          return newResult;
        });
        resultsToShow?.forEach((result: any) => {
          if (!nameValues.includes(result.properties.name)) {
            nameValues.push(result.properties.name);
            const geometry = {
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
            features.push(geometry);
          }
        });

        const locationGraphic = {
          geometry: {
            type: 'point',
            longitude: location.location.x,
            latitude: location.location.y,
            spatialreference: {
              wkid: 4326,
            },
          },
          symbol: {
            type: 'picture-marker',
            url: locationMarker,
            width: 150,
            height: 150,
          },
        };

        const locationLayer = new GraphicsLayer({
          graphics: [locationGraphic],
        });

        view.map.add(locationLayer);

        const stopLayer = new FeatureLayer({
          source: features, // autocast as a Collection of new Graphic()
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
          title: '{NAME}, {BUSAREA}',
        };

        stopLayer.popupTemplate = popup;
        view.map.add(stopLayer);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }, [view, location, stopResults]);

  useEffect(() => {
    if (location?.location) {
      // Make api call to get nearest stops to location
      getStopAPIResults(location.location);
    }
  }, [location, getStopAPIResults]);

  useEffect(() => {
    // When stop results are added, add nearest bus stops to map
    const areas = Object.keys(busAreas).map((key) => busAreas[key]);
    if (mapView && stopResults.length > 0) {
      // areas.forEach((area) => {
      //   view.map.findLayerById(area.id).visible = false;
      // });

      mapDispatch({
        type: 'UPDATE_STOP_RESULTS',
        payload: { autoCompleteId: id, location, nearestStops: stopResults },
      });
      addStopsToMap();
    }
  }, [mapView, mapDispatch, id, location, stopResults, view, busAreas, addStopsToMap]);

  const onUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  const onSelect = (result: any) => {
    setLocation(result);
  };
  const onClear = () => {
    setLocation(null);
    const payload = selectedStops.filter((stop) => stop.autoCompleteId !== id);
    formDispatch({ type: 'UPDATE_SELECTED_STOPS', payload });
  };
  const handleStopSelect = (result: any) => {
    onBusStopSelect(id, location, result);
  };
  const getMiles = (i: number) => {
    return (i * 0.000621371192).toFixed(1);
  };

  return (
    <>
      <div className="wmnds-m-b-md">
        <AutoComplete
          label={label}
          name={name}
          placeholder="Search"
          onUpdate={onUpdate}
          onClear={onClear}
          initialQuery={query}
          selectedItem={selectedItem?.properties || location}
          onSelectResult={onSelect}
          results={locationResults}
          loading={loading}
          errorMessage={
            <Message
              type="error"
              title={errorInfo?.title}
              message={errorInfo?.message}
              showRetry={errorInfo?.isTimeoutError}
              retryCallback={getAPIResults}
            />
          }
        />
      </div>
      {!mapView && location && (
        <>
          {stopsLoading ? (
            <div className="wmnds-p-md">
              <Loader />
            </div>
          ) : (
            <>
              {!selectedItem && (
                <div className="wmnds-m-b-md">
                  {stopResults.length > 0 ? (
                    <>
                      <p className="wmnds-m-b-md">Select your stop from the list</p>
                      {stopResults.map((res) => (
                        <Button
                          key={res.properties.atcoCode}
                          text={`${res.properties.name}, (${
                            getMiles(res.properties.distance) < '0.1'
                              ? '> 0.1'
                              : getMiles(res.properties.distance)
                          } miles away)`}
                          btnClass="wmnds-btn--link wmnds-btn--align-left wmnds-m-b-sm"
                          onClick={() => handleStopSelect(res)}
                        />
                      ))}
                    </>
                  ) : (
                    <Message
                      type="error"
                      title={stopErrorInfo?.title}
                      message={stopErrorInfo?.message}
                    />
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}
      {mapView && location && (
        <div className="wmnds-msg-help">Select your bus stop from the map</div>
      )}
    </>
  );
};

export default BusStopAutoComplete;
