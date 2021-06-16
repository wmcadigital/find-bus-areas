import BusStopSearch from 'components/shared/BusStopSearch/BusStopSearch';

const ListView = () => {
  return (
    <div className="wmnds-container">
      <div className="wmnds-grid">
        <div className="wmnds-col-2-3">
          <BusStopSearch />
        </div>
      </div>
    </div>
  );
};

export default ListView;
