import { useEffect, useState } from 'react';
import { useFormContext, useMapContext } from 'globalState';
import useToggleBusAreas from 'globalState/customHooks/useToggleBusAreas';
import Button from 'components/shared/Button/Button';
import Icon from 'components/shared/Icon/Icon';
import useClearSearch from 'components/shared/BusStopSearch/useClearSearch';
import arrayToSentence from 'globalState/helpers/arrayToSentence';
import Radio from 'components/shared/Radios/Radio/Radio';
import useRecommendedBusArea from './useRecommendedBusArea';

function BusStopResult() {
  const [{ selectedStops, ticketSearch }] = useFormContext();
  const [{ view }] = useMapContext();
  const { toggleBusArea, busAreasArray } = useToggleBusAreas();
  const { clearSearch } = useClearSearch();
  const recommendedAreas = useRecommendedBusArea();
  const [selectedArea, setSelectedArea] = useState(null);
  const [valid, setValid] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!selectedArea) {
      setSelectedArea(recommendedAreas?.text);
    }
    if (!completed) {
      if (valid) {
        setValid(true);
      }
      setCompleted(true);
      busAreasArray.forEach((area) => {
        if (selectedArea === area.properties.area_name) {
          toggleBusArea(area, true);
        } else {
          toggleBusArea(area, false);
        }
      });
    }
  }, [view, completed, valid, selectedArea, recommendedAreas, busAreasArray, toggleBusArea]);

  const handleRadioChange = (e: any) => {
    setSelectedArea(e.target.value);
    setValid(true);
    setCompleted(false);
  };

  return (
    <div className="wmnds-p-b-lg">
      {recommendedAreas && (
        <>
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
            <strong>{recommendedAreas.text} bus area</strong> ticket.
          </div>
          {ticketSearch && (
            <>
              {recommendedAreas.options.length > 1 && (
                <div className="wmnds-fe-group wmnds-m-b-md">
                  <fieldset className="wmnds-fe-fieldset">
                    <legend className="wmnds-fe-fieldset__legend">
                      <h3>Please select your preferred area</h3>
                    </legend>
                    {recommendedAreas.options.map((option: any) => (
                      <Radio
                        key={option}
                        name="busArea"
                        text={option}
                        value={option}
                        onChange={handleRadioChange}
                      />
                    ))}
                  </fieldset>
                </div>
              )}
              {valid && (
                <div className="wmnds-m-b-md">
                  <a
                    href={`https://find-a-ticket.tfwm.org.uk/?busArea=${encodeURI(selectedArea!)}`}
                    className="wmnds-btn"
                  >
                    Continue with your ticket{' '}
                    <Icon
                      className="wmnds-btn__icon wmnds-btn__icon--right"
                      iconName="general-chevron-right"
                    />
                  </a>
                </div>
              )}
            </>
          )}
          <Button
            onClick={clearSearch}
            btnClass="wmnds-btn--secondary"
            text="Make another search"
          />
        </>
      )}
    </div>
  );
}

export default BusStopResult;
