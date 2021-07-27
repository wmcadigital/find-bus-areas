/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
// Import context
import { useFormContext, useMapContext } from 'globalState';
// eslint-disable-next-line import/no-unresolved
// Import components
import AutoComplete from 'components/shared/AutoComplete/AutoComplete';
import Button from 'components/shared/Button/Button';
import Message from 'components/shared/Message/Message';
import Loader from 'components/shared/Loader/Loader';
// Import custom hooks
import useLocationAPI from './customHooks/useLocationAPI';
import useBusStopAPI from './customHooks/useBusStopAPI';
import useAddStopsToMap from './customHooks/useUpdateMapStops';
import useBusStopSelect from './customHooks/useBusStopSelect';

const BusStopAutoComplete = ({ id, label, name }: { id: string; label?: string; name: string }) => {
  const [{ mapView, selectedStops }, formDispatch] = useFormContext();
  const [{ view, busAreas, isStopsLayerCreated }, mapDispatch] = useMapContext();
  const [query, setQuery] = useState('');
  const [mustUpdate, setMustUpdate] = useState(true);
  const [location, setLocation] = useState<any>();
  const { onBusStopSelect } = useBusStopSelect();
  const selectedItem = selectedStops.find((stop) => stop.autoCompleteId === id) || null;
  const { updateMapStops, selectedResult } = useAddStopsToMap();
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

  const handleStopSelect = (result: any) => {
    onBusStopSelect(id, location, result);
  };

  useEffect(() => {
    if (mapView && selectedResult && mustUpdate) {
      onBusStopSelect(id, location, selectedResult);
      setMustUpdate(false);
    }
  }, [id, location, mapView, onBusStopSelect, selectedResult, mustUpdate]);

  useEffect(() => {
    if (location?.location) {
      // Make api call to get nearest stops to location
      getStopAPIResults(location.location);
    }
  }, [location, getStopAPIResults]);

  useEffect(() => {
    // When stop results are added, add nearest bus stops to map
    // const areas = Object.keys(busAreas).map((key) => busAreas[key]);
    if (mapView && stopResults.length > 0) {
      // areas.forEach((area) => {
      //   view.map.findLayerById(area.id).visible = false;
      // });

      mapDispatch({
        type: 'UPDATE_STOP_RESULTS',
        payload: { autoCompleteId: id, location, nearestStops: stopResults },
      });
      if (isStopsLayerCreated) {
        updateMapStops(stopResults);
      }
    }
  }, [
    mapView,
    mapDispatch,
    id,
    location,
    stopResults,
    // view,
    // busAreas,
    updateMapStops,
    isStopsLayerCreated,
  ]);

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
              {!selectedItem?.properties && (
                <div className="wmnds-m-b-md">
                  {stopResults.length > 0 ? (
                    <>
                      <p className="wmnds-m-b-md">Select your stop from the list</p>
                      {stopResults.map((res) => (
                        <Button
                          key={`${id}-${res.properties.atcoCode}`}
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
      {mapView && location && !selectedItem?.properties && (
        <div className="wmnds-msg-help">
          Select your bus stop from the map and confirm your bus stop in the pop-up box
        </div>
      )}
    </>
  );
};

export default BusStopAutoComplete;
