/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
// Import components
import AutoComplete from 'components/shared/AutoComplete/AutoComplete';
import Message from 'components/shared/Message/Message';
// Import custom hooks
import useLocationAPI from './customHooks/useLocationAPI';
import useBusStopAPI from './customHooks/useBusStopAPI';

const BusStopAutoComplete = () => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<any>();
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
  const { loading: locationLoading, getAPIResults: getStopAPIResults } = useBusStopAPI();

  useEffect(() => {
    if (selected?.location) {
      // Make api call to get nearest stops to location
      console.log(selected.location);
      getStopAPIResults(selected.location);
    }
  }, [selected, getStopAPIResults]);

  const onUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  const onSelect = (result: any) => {
    setSelected(result);
  };
  return (
    <div className="wmnds-m-b-md">
      <AutoComplete
        label="From:"
        name="BusStopFrom"
        placeholder="Search"
        onUpdate={onUpdate}
        initialValue={query}
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
  );
};

export default BusStopAutoComplete;
