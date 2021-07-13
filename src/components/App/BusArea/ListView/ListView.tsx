import { useFormContext } from 'globalState';
import BusStopSearch from 'components/shared/BusStopSearch/BusStopSearch';
import BusStopResult from 'components/shared/BusStopAutoComplete/BusStopResult/BusStopResult';

const ListView = () => {
  const [{ showResult, selectedStops }, formDispatch] = useFormContext();
  const onComplete = () => {
    if (!selectedStops.every((stop) => stop.geometry)) {
      formDispatch({
        type: 'UPDATE_SELECTED_STOPS',
        payload: [...selectedStops.filter((stop) => stop.geometry)],
      });
    }
    formDispatch({ type: 'SHOW_RESULT', payload: true });
  };

  return (
    <div className="wmnds-container">
      {!showResult && (
        <div className="wmnds-p-b-lg">
          <p>Search for bus stops to find out which bus areas you need your ticket to cover.</p>
          <p className="wmnds-inset-text wmnds-m-b-none">
            If you do not know where to travel to, use our{' '}
            <a href="https://journeyplanner.tfwm.org.uk/">journey planner</a> instead.
          </p>
        </div>
      )}
      <div className="wmnds-grid">
        <div className="wmnds-col-2-3">
          {!showResult ? <BusStopSearch onComplete={onComplete} /> : <BusStopResult />}
        </div>
      </div>
    </div>
  );
};

export default ListView;
