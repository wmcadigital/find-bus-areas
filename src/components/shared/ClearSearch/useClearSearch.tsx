import { useFormContext, useMapContext } from 'globalState';

const useClearSearch = () => {
  const [, formDispatch] = useFormContext();
  const [, mapDispatch] = useMapContext();
  const clearSearch = () => {
    formDispatch({ type: 'UPDATE_SELECTED_STOPS', payload: [] });
    mapDispatch({ type: 'UPDATE_STOP_RESULTS', payload: [] });
    formDispatch({ type: 'SHOW_RESULT', payload: false });
  };
  return { clearSearch };
};

export default useClearSearch;
