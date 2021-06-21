import Button from 'components/shared/Button/Button';
import BusStopAutoComplete from 'components/shared/BusStopAutoComplete/BusStopAutoComplete';
import { useFormContext } from 'globalState';
import BusStopResult from '../BusStopAutoComplete/BusStopResult/BusStopResult';
import s from './BusStopSearch.module.scss';

const BusStopSearch = () => {
  const [{ mapView, selectedStops }] = useFormContext();
  const addBusStop = () => {
    console.log('add bus stop');
  };
  return (
    <div>
      <div className="wmnds-text-align-right">
        <Button btnClass="wmnds-btn--link wmnds-m-l-md" text="Clear search" />
      </div>
      <p className="h3">All companies (nBus and nNetwork)</p>
      <p className="h4 wmnds-m-b-lg">Find out which bus areas specific stops are in</p>
      <ol className="wmnds-in-text-step">
        <li className="wmnds-in-text-step__item">
          Search for a postcode, road name or point of interest
        </li>
        <li className="wmnds-in-text-step__item">
          Select a bus stop from the {mapView ? 'map' : 'list'}
        </li>
      </ol>
      <BusStopAutoComplete />
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
      {selectedStops.length > 1 && <BusStopResult />}
    </div>
  );
};

export default BusStopSearch;
