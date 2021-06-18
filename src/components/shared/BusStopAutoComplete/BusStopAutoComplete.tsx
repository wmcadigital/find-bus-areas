import React, { useState } from 'react';
// Import context
import { useFormContext } from 'globalState';
// Import components
import AutoComplete from 'components/shared/AutoComplete/AutoComplete';
import Button from 'components/shared/Button/Button';
import Message from 'components/shared/Message/Message';
// Import styles
import s from './BusStopAutoComplete.module.scss';
// Import custom hooks
import useBusStopAPI from './customHooks/useBusStopAPI';

const BusStopAutoComplete = () => {
  const [formState] = useFormContext();
  const { mapView } = formState;
  const [query, setQuery] = useState('');
  const [, setSelected] = useState();
  const { results, loading, errorInfo, getAPIResults } = useBusStopAPI(
    `/api/lineinfo?q=${encodeURI(query.toLowerCase())}`
  );
  const addBusStop = () => {
    console.log('add bus stop');
  };
  const onUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  const onSelect = (result: any) => {
    setSelected(result);
  };
  return (
    <>
      <div className={`${s.traySearchContainer}`}>
        <div className="wmnds-m-b-md">
          <AutoComplete
            label="From:"
            name="BusStopFrom"
            placeholder="Search"
            onUpdate={onUpdate}
            initialValue={query}
            onSelectResult={onSelect}
            results={results}
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
        <div className="wmnds-m-b-md">
          <AutoComplete
            label="To:"
            name="BusStopTo"
            placeholder="Search"
            onUpdate={onUpdate}
            onSelectResult={onSelect}
            results={results}
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
        <div className={`wmnds-grid wmnds-m-b-lg ${mapView ? '' : 'wmnds-grid--spacing-2-md'}`}>
          <div className={mapView ? 'wmnds-col-1' : 'wmnds-col-1-2'}>
            <Button
              btnClass={`wmnds-btn--primary wmnds-col-1 ${s.addBtn}`}
              iconRight="general-expand"
              text="Add another stop"
              onClick={addBusStop}
              // disabled={selectedBusStops.length >= 12}
            />
          </div>
          {!mapView && (
            <div className="wmnds-col-1-2">
              <Button
                btnClass="wmnds-col-1"
                iconRight="general-chevron-right"
                text="Search for bus area"
              />
            </div>
          )}
        </div>
        <div className="wmnds-msg-help">Select your bus stop from the map</div>
      </div>
    </>
  );
};

export default BusStopAutoComplete;
