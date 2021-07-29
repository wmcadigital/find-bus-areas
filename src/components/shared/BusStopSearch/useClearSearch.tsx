import { useFormContext, useMapContext } from 'globalState';

const useClearSearch = () => {
  const [, formDispatch] = useFormContext();
  const [{ view }, mapDispatch] = useMapContext();
  const clearSearch = () => {
    if (view) {
      const layersToRemove = view.map.layers.items.filter(
        (item: any) => item.id.includes('selectedStop') || item.id.includes('additionalStop')
      );
      layersToRemove.forEach((layer: any) => {
        view.map.layers.remove(layer);
      });
    }
    formDispatch({ type: 'UPDATE_SELECTED_STOPS', payload: [] });
    mapDispatch({ type: 'UPDATE_STOP_RESULTS', payload: {} });
    mapDispatch({ type: 'RESET_FORM', payload: true });
    formDispatch({ type: 'SHOW_RESULT', payload: false });
  };
  return { clearSearch };
};

export default useClearSearch;
