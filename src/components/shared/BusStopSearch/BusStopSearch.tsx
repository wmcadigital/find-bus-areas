import Button from 'components/shared/Button/Button';
import BusStopAutoComplete from 'components/shared/BusStopAutoComplete/BusStopAutoComplete';
import { useFormContext } from 'globalState';
import BusStopResult from '../BusStopAutoComplete/BusStopResult/BusStopResult';

const BusStopSearch = () => {
  const [{ mapView, selectedStops }] = useFormContext();
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
      {selectedStops.length > 1 && <BusStopResult />}
    </div>
  );
};

export default BusStopSearch;
