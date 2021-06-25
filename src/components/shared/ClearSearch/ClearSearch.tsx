import { useFormContext, useMapContext } from 'globalState';
import Button from 'components/shared/Button/Button';

const ClearSearch = () => {
  const [, formDispatch] = useFormContext();
  const [, mapDispatch] = useMapContext();

  const clearSearch = () => {
    formDispatch({ type: 'UPDATE_SELECTED_STOPS', payload: [] });
    mapDispatch({ type: 'UPDATE_STOP_RESULTS', payload: [] });
  };
  return (
    <div className="wmnds-text-align-right">
      <Button btnClass="wmnds-btn--link wmnds-m-l-md" text="Clear search" onClick={clearSearch} />
    </div>
  );
};

export default ClearSearch;
