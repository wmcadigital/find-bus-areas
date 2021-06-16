// Import context
import { useFormContext } from 'globalState';
// Import components
import AutoComplete from 'components/shared/AutoComplete/AutoComplete';
import Button from 'components/shared/Button/Button';
// Import styles
import s from './BusStopAutoComplete.module.scss';
import BusStopResult from './BusStopResult/BusStopResult';

const BusStopAutoComplete = () => {
  const [formState] = useFormContext();
  const { mapView } = formState;
  const addBusStop = () => {
    console.log('add bus stop');
  };
  return (
    <>
      <div className={`${s.traySearchContainer}`}>
        <div className="wmnds-m-b-md">
          <AutoComplete label="From:" name="BusStopFrom" placeholder="Search" />
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
        <BusStopResult />
      </div>
    </>
  );
};

export default BusStopAutoComplete;
