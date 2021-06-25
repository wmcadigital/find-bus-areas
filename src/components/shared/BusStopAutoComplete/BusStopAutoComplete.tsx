/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
// Import context
import { useFormContext, useMapContext } from 'globalState';
// Import components
import AutoComplete from 'components/shared/AutoComplete/AutoComplete';
import Message from 'components/shared/Message/Message';
import Loader from 'components/shared/Loader/Loader';
import Radio from 'components/shared/Radios/Radio/Radio';
// Import custom hooks
import useLocationAPI from './customHooks/useLocationAPI';
import useBusStopAPI from './customHooks/useBusStopAPI';
import useBusStopSelect from './customHooks/useBusStopSelect';

const BusStopAutoComplete = ({ id, label, name }: { id: string; label?: string; name: string }) => {
  const [{ mapView, selectedStops }, formDispatch] = useFormContext();
  const [, mapDispatch] = useMapContext();
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

  useEffect(() => {
    if (location?.location) {
      // Make api call to get nearest stops to location
      getStopAPIResults(location.location);
    }
  }, [location, getStopAPIResults]);

  useEffect(() => {
    // When stop results are added, add nearest bus stops to map
    if (mapView && stopResults.length > 0) {
      mapDispatch({ type: 'UPDATE_STOP_RESULTS', payload: stopResults });
    }
  }, [mapView, mapDispatch, stopResults]);

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
