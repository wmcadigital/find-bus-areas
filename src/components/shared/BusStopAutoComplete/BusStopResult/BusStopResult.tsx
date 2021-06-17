import Button from 'components/shared/Button/Button';

function BusStopResult() {
  return (
    <div className="wmnds-p-b-lg">
      <p>
        Brook St is in the <strong>Sandwell and Dudley</strong>, <strong>Black Country</strong> and{' '}
        <strong>West Midlands bus area.</strong>
      </p>
      <p>
        Brierley Hill Rd is in the <strong>Sandwell and Dudley</strong>,{' '}
        <strong>Black Country</strong> and <strong>West Midlands bus area.</strong>
      </p>
      <div className="wmnds-p-md wmnds-m-b-lg wmnds-msg-help">
        To travel between these bus stops, you’ll need a <strong>Sandwell and Dudley</strong>{' '}
        ticket.
      </div>
      <Button iconRight="general-chevron-right" text="Continue with your ticket" />
      <Button btnClass="wmnds-btn--secondary wmnds-m-t-md" text="Make another search" />
    </div>
  );
}

export default BusStopResult;
