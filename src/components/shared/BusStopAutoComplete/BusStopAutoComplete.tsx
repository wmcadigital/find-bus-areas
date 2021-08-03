import React, { useState, useEffect, useLayoutEffect } from 'react';
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
import useBusStopSelect from './customHooks/useBusStopSelect';
import useCreateStopsLayer from './customHooks/useCreateStopsLayer';
import useUpdateStopsLayer from './customHooks/useUpdateStopsLayer';
// Import Helpers
import metersToMiles from './helpers/metersToMiles';

const BusStopAutoComplete = ({
  id,
  label,
  name,
  isReset,
}: {
  id: string;
  label?: string;
  name: string;
  isReset: any;
}) => {
  const [{ listView, selectedStops }, formDispatch] = useFormContext();
  const [{ view }, mapDispatch] = useMapContext();
  const [query, setQuery] = useState('');
  const [mustUpdateSelection, setMustUpdateSelection] = useState(true);
  const [location, setLocation] = useState<any>();
  const { onBusStopSelect } = useBusStopSelect();
  const selectedItem = selectedStops.find((stop) => stop.autoCompleteId === id) || null;
  const { isStopsLayerCreated, setIsStopsLayerCreated } = useCreateStopsLayer(view, id);
  const { updateMapStops, selectedResult } = useUpdateStopsLayer();
  const [stopResults, setStopResults] = useState<any>([]);
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
    results: apiStopResults,
    loading: stopsLoading,
    getAPIResults: getStopAPIResults,
    errorInfo: stopErrorInfo,
  } = useBusStopAPI(location);

  // Filter already selected stops from list
  useEffect(() => {
    if (apiStopResults.length && selectedStops.length) {
      const filteredResults = apiStopResults.filter((result: any) => {
        const match = selectedStops.find(
          (stop) => stop.properties?.atcoCode === result.properties?.atcoCode
        );
        return !match && true;
      });
      setStopResults(filteredResults);
    } else if (apiStopResults.length) {
      setStopResults(apiStopResults);
    }
  }, [apiStopResults, selectedStops]);

  // Update selected stops state when map stop is selected
  useEffect(() => {
    if (!listView && selectedResult && mustUpdateSelection) {
      onBusStopSelect(id, location, selectedResult);
      setMustUpdateSelection(false);
    }
  }, [id, location, listView, onBusStopSelect, selectedResult, mustUpdateSelection]);

  useEffect(() => {
    if (location?.location) {
      // Make api call to get nearest stops to location
      getStopAPIResults(location.location);
    }
  }, [location, getStopAPIResults]);

  useEffect(() => {
    // When stop results are added, add nearest bus stops to map
    if (!listView && stopResults?.length > 0 && location && !selectedResult) {
      mapDispatch({
        type: 'UPDATE_STOP_RESULTS',
        payload: { autoCompleteId: id, location, nearestStops: stopResults },
      });
    }
  }, [listView, mapDispatch, id, location, stopResults, isStopsLayerCreated, selectedResult]);

  useEffect(() => {
    if (!listView && isStopsLayerCreated) {
      updateMapStops(id, stopResults);
    }
  }, [listView, stopResults, updateMapStops, isStopsLayerCreated, id]);

  // set query state on input change
  const onUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  // set location on select
  const onSelect = (result: any) => {
    setLocation(result);
  };
  // action when autocomplete is cleared
  const onClear = () => {
    setLocation(null);
    const payload = selectedStops.filter((stop) => stop.autoCompleteId !== id);
    formDispatch({ type: 'UPDATE_SELECTED_STOPS', payload });
    if (view) {
      updateMapStops(id, []);
      const layerToRemove = view.map.findLayerById(id);
      if (layerToRemove) {
        view.map.layers.remove(layerToRemove);
      }
      setIsStopsLayerCreated(false);
    }
    isReset(true);
  };

  const errorMessage = (
    <Message
      type="error"
      title={errorInfo?.title}
      message={errorInfo?.message}
      showRetry={errorInfo?.isTimeoutError}
      retryCallback={getAPIResults}
    />
  );

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
          errorMessage={errorMessage}
        />
      </div>
      {listView && location && (
        <>
          {stopsLoading ? (
            <div className="wmnds-p-md">
              <Loader />
            </div>
          ) : (
            <>
              {!selectedItem?.properties && (
                <div className="wmnds-m-b-md">
                  {stopResults?.length > 0 ? (
                    <>
                      <p className="wmnds-m-b-md">Select your stop from the list</p>
                      {stopResults.map((res: any) => (
                        <Button
                          key={`${id}-${res.properties.atcoCode}`}
                          text={`${res.properties.name}, (${
                            metersToMiles(res.properties.distance) < '0.1'
                              ? '> 0.1'
                              : metersToMiles(res.properties.distance)
                          } miles away)`}
                          btnClass="wmnds-btn--link wmnds-btn--align-left wmnds-m-b-sm"
                          onClick={() => onBusStopSelect(id, location, res)}
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
      {!listView && location && !selectedItem?.properties && (
        <>
          {stopResults?.length > 0 ? (
            <div className="wmnds-msg-help wmnds-m-b-md">
              Select your bus stop from the map and confirm your bus stop in the pop-up box
            </div>
          ) : (
            <Message type="error" title={stopErrorInfo?.title} message={stopErrorInfo?.message} />
          )}
        </>
      )}
    </>
  );
};

const MountedAutoComplete = ({ id, label, name }: { id: string; label?: string; name: string }) => {
  const [isCleared, setIsCleared] = useState(false);
  useLayoutEffect(() => {
    if (isCleared) setIsCleared(false);
  }, [isCleared]);

  return (
    <>
      {!isCleared && (
        <BusStopAutoComplete id={id} label={label} name={name} isReset={setIsCleared} />
      )}
    </>
  );
};

export default MountedAutoComplete;
