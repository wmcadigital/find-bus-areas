import { useEffect, useState } from 'react';
import { useFormContext, useMapContext } from 'globalState';
import Button from 'components/shared/Button/Button';
import Icon from 'components/shared/Icon/Icon';
import useClearSearch from 'components/shared/ClearSearch/useClearSearch';
import arrayToSentence from 'globalState/helpers/arrayToSentence';
import Radio from 'components/shared/Radios/Radio/Radio';
import useRecommendedBusArea from './useRecommendedBusArea';

function BusStopResult() {
  const [{ selectedStops, ticketSearch }] = useFormContext();
  const [{ view, busAreas }] = useMapContext();
  const { clearSearch } = useClearSearch();
  const recommendedAreas = useRecommendedBusArea();
  const [selectedArea, setSelectedArea] = useState(recommendedAreas?.text);

  useEffect(() => {
    const areas = Object.keys(busAreas).map((key) => busAreas[key]);
    if (view && recommendedAreas) {
      areas.forEach((area) => {
        if (recommendedAreas.options.includes(area.properties.area_name)) {
          view.map.findLayerById(area.id).visible = true;
        } else {
          view.map.findLayerById(area.id).visible = false;
        }
      });
    }
  }, [view, busAreas, recommendedAreas]);

  const handleRadioChange = (e: any) => {
    const areas = Object.keys(busAreas).map((key) => busAreas[key]);
    if (view && selectedArea) {
      areas.forEach((area) => {
        if (area.properties.area_name === selectedArea) {
          view.map.findLayerById(area.id).visible = true;
        } else {
          view.map.findLayerById(area.id).visible = false;
        }
      });
    }
    setSelectedArea(e.target.value);
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
              <div className="wmnds-m-b-md">
                <a
                  href={`https://find-a-ticket.tfwm.org.uk/?busArea=${encodeURI(
                    recommendedAreas.options.length > 1 ? selectedArea : recommendedAreas.text
                  )}`}
                  className="wmnds-btn"
                >
                  Continue with your ticket{' '}
                  <Icon
                    className="wmnds-btn__icon wmnds-btn__icon--right"
                    iconName="general-chevron-right"
                  />
                </a>
              </div>
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
