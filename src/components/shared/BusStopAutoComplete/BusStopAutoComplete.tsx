/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
// Import context
import { useFormContext, useMapContext } from 'globalState';
// eslint-disable-next-line import/no-unresolved
import { loadModules } from 'esri-loader';
import mapMarker from 'assets/svgs/map/map-marker.svg';
// Import components
import AutoComplete from 'components/shared/AutoComplete/AutoComplete';
import Message from 'components/shared/Message/Message';
import Loader from 'components/shared/Loader/Loader';
import Radio from 'components/shared/Radios/Radio/Radio';
// Import custom hooks
import useLocationAPI from './customHooks/useLocationAPI';
import useBusStopAPI from './customHooks/useBusStopAPI';
import useBusStopSelect from './customHooks/useBusStopSelect';
import BusStopResult from './BusStopResult/BusStopResult';

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
    loading: locationLoading,
    getAPIResults: getStopAPIResults,
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
        const resultsToShow = stopResults.map((res) => {
          const newResult = res;
          newResult.properties.name = res.properties.name.replace(/ *\([^)]*\) */g, '');
          return newResult;
        });
        resultsToShow.forEach((result) => {
          if (!nameValues.includes(result.properties.name)) {
            nameValues.push(result.properties.name);
            const geometry = {
              attributes: {
                name: result.properties.name,
                atcoCode: result.properties.atcoCode,
                // whatever else you'll need - then reference in the 'fields' property below
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

        console.log(features);

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
          title: '{NAME}',
        };

        stopLayer.popupTemplate = popup;
        view.map.add(stopLayer);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }, [view, stopResults]);

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
      areas.forEach((area) => {
        view.map.findLayerById(area.id).visible = false;
      });

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
  const onRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onBusStopSelect(
      id,
      location,
      stopResults.find((res) => res.properties.atcoCode === e.target.value)
    );
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
          selectedItem={selectedItem?.selectedLocation || location}
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
          {locationLoading ? (
            <div className="wmnds-p-md">
              <Loader />
            </div>
          ) : (
            <div className="wmnds-m-b-md">
              {stopResults.map((res) => (
                <Radio
                  key={res.properties.atcoCode}
                  name={id}
                  text={res.properties.name}
                  value={res.properties.atcoCode}
                  onChange={onRadioChange}
                />
              ))}
            </div>
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
