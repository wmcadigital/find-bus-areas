import { useFormContext } from 'globalState';
import Button from 'components/shared/Button/Button';
import Breadcrumbs from 'components/shared/Breadcrumbs/Breadcrumbs';
import Icon from 'components/shared/Icon/Icon';
import MapView from './MapView/MapView';
import ListView from './ListView/ListView';
import s from './BusArea.module.scss';

const BusAreas = () => {
  const [formState, formDispatch] = useFormContext();
  const { ticketSearch, listView } = formState;
  const toggleView = () => {
    formDispatch({ type: 'CHANGE_VIEW', payload: !formState.listView });
  };
  return (
    <>
      <div className="wmnds-container">
        {ticketSearch ? (
          <div className="wmnds-m-b-lg wmnds-m-t-md">
            <a
              href="https://find-a-ticket.tfwm.org.uk/"
              className={`wmnds-btn wmnds-btn--link ${s.backLink}`}
            >
              <Icon iconName="general-chevron-right" /> Back to ticket finder
            </a>
          </div>
        ) : (
          <Breadcrumbs />
        )}
        <div className={`wmnds-grid wmnds-grid--justify-between ${s.mainHeading}`}>
          <div className="wmnds-col-auto">
            <h1>Find my bus area {listView ? 'in a list' : 'on a map'}</h1>
          </div>
          <div className="wmnds-col-auto">
            <Button
              text={`Find my bus area ${listView ? 'on a map' : 'in a list'}`}
              btnClass="wmnds-btn--secondary"
              iconRight={`general-${listView ? 'list' : 'location-pin'}`}
              onClick={toggleView}
            />
          </div>
        </div>
      </div>
      {listView ? <ListView /> : <MapView />}
    </>
  );
};

export default BusAreas;
