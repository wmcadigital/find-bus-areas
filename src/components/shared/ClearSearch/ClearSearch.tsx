import Button from 'components/shared/Button/Button';

import useClearSearch from './useClearSearch';

const ClearSearch = () => {
  const { clearSearch } = useClearSearch();
  return (
    <div className="wmnds-text-align-right">
      <Button btnClass="wmnds-btn--link wmnds-m-l-md" text="Clear search" onClick={clearSearch} />
    </div>
  );
};

export default ClearSearch;
