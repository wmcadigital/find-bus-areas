import Button from 'components/shared/Button/Button';
// import Breadcrumbs from 'components/shared/Breadcrumbs/Breadcrumbs';
import Icon from 'components/shared/Icon/Icon';
import s from './BusArea.module.scss';

const BusAreas = () => {
  return (
    <>
      <div className="wmnds-container">
        {/* if ticket mode */}
        <div className="wmnds-m-b-lg wmnds-m-t-md">
          <a
            href="https://find-a-ticket.wmnetwork.co.uk/"
            className={`wmnds-btn wmnds-btn--link ${s.backLink}`}
          >
            <Icon iconName="general-chevron-right" /> Back to ticket finder
          </a>
        </div>
        {/* else */}
        {/* <Breadcrumbs /> */}
        <div className={`wmnds-grid wmnds-grid--justify-between ${s.mainHeading}`}>
          <div className="wmnds-col-auto">
            <h1>Find my bus area in a list</h1>
          </div>
          <div className="wmnds-col-auto">
            <Button
              text="Find my bus area on a map"
              btnClass="wmnds-btn--secondary"
              iconRight="general-location-pin"
            />
          </div>
        </div>
        <div className="wmnds-grid">
          <div className="wmnds-col-md-3-4">
            <p>Search for bus stops to find out which bus areas you need your ticket to cover.</p>
            <p className="wmnds-inset-text wmnds-m-b-none">
              If you do not know where to travel to, use our <a href="#0">journey planner</a>{' '}
              instead.
            </p>
            <p className="h3 wmnds-m-b-lg">Find out which bus areas specific stops are in</p>
            <ol className="wmnds-in-text-step">
              <li className="wmnds-in-text-step__item">
                Search for a postcode, road name or point of interest
              </li>
              <li className="wmnds-in-text-step__item">Select a bus stop from the list</li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
};

export default BusAreas;
