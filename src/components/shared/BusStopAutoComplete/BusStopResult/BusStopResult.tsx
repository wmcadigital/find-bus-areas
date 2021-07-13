import { useFormContext } from 'globalState';
import Button from 'components/shared/Button/Button';
import Icon from 'components/shared/Icon/Icon';
import useClearSearch from 'components/shared/ClearSearch/useClearSearch';
import arrayToSentence from 'globalState/helpers/arrayToSentence';

function BusStopResult() {
  const [{ selectedStops, ticketSearch }] = useFormContext();
  const { clearSearch } = useClearSearch();
  const getRecommendation = () => {
    const smallestAreas: any = [];
    let busArea = 'West Midlands';
    selectedStops.forEach((stop) => {
      let recommendation: any = 'West Midlands';
      if (
        stop.stopBusAreas.includes('Walsall') ||
        stop.stopBusAreas.includes('Sandwell and Dudley') ||
        stop.stopBusAreas.includes('Coventry')
      ) {
        recommendation = stop.stopBusAreas.filter(
          (area: any) => area !== 'West Midlands' && area !== 'Black Country'
        );
        if (recommendation.length === 1) {
          recommendation = recommendation.join();
        }
      } else if (stop.stopBusAreas.includes('Black Country')) {
        recommendation = 'Black Country';
      }
      smallestAreas.push(recommendation);
    });

    if (smallestAreas.every((area: any) => typeof area === 'object')) {
      busArea = 'Walsall or Sandwell and Dudley';
    } else if (smallestAreas.some((area: any) => typeof area === 'object')) {
      const strings = smallestAreas.filter((area: any) => typeof area !== 'object');
      if (strings.includes('West Midlands') || strings.includes('Coventry')) {
        busArea = 'West Midlands';
      } else if (
        strings.includes('Black Country') ||
        (strings.includes('Walsall') && strings.includes('Sandwell and Dudley'))
      ) {
        busArea = 'Black Country';
      } else if (strings.includes('Walsall')) {
        busArea = 'Walsall';
      } else if (strings.includes('Sandwell and Dudley')) {
        busArea = 'Sandwell and Dudley';
      }
    } else if (
      (smallestAreas.includes('Black Country') && !smallestAreas.includes('Coventry')) ||
      (smallestAreas.includes('Black Country') && !smallestAreas.includes('West Midlands'))
    ) {
      busArea = 'Black Country';
    } else if (smallestAreas.includes('Coventry')) {
      if (
        !smallestAreas.includes('Walsall') &&
        !smallestAreas.includes('Black Country') &&
        !smallestAreas.includes('Sandwell and Dudley') &&
        !smallestAreas.includes('West Midlands')
      ) {
        busArea = 'Coventry';
      }
    }

    return busArea;
  };
  return (
    <div className="wmnds-p-b-lg">
      <h3 className="wmnds-m-b-lg">Your bus area</h3>
      {selectedStops.map((stop) => (
        <p key={stop.properties.atcoCode}>
          {stop.properties.name} is in the{' '}
          <strong>
            {arrayToSentence(stop.stopBusAreas)} bus area{stop.stopBusAreas.length > 1 && 's'}.
          </strong>
        </p>
      ))}
      <div className="wmnds-p-md wmnds-m-b-lg wmnds-msg-help">
        To travel between these bus stops, you’ll need a{' '}
        <strong>{getRecommendation()} bus area</strong> ticket.
      </div>
      {!ticketSearch && (
        <div className="wmnds-m-b-md">
          <a href="https://find-a-ticket.tfwm.org.uk" className="wmnds-btn">
            Continue with your ticket{' '}
            <Icon
              className="wmnds-btn__icon wmnds-btn__icon--right"
              iconName="general-chevron-right"
            />
          </a>
        </div>
      )}
      <Button onClick={clearSearch} btnClass="wmnds-btn--secondary" text="Make another search" />
    </div>
  );
}

export default BusStopResult;
