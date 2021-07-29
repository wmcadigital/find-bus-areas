import { useFormContext, useMapContext } from 'globalState';
import useToggleBusAreas from 'globalState/customHooks/useToggleBusAreas';

const useClearSearch = () => {
  const [, formDispatch] = useFormContext();
  const [{ view }, mapDispatch] = useMapContext();
  const { toggleBusArea, busAreasArray } = useToggleBusAreas();

  const clearSearch = () => {
    if (view) {
      const layersToRemove = view.map.layers.items.filter(
        (item: any) => item.id.includes('selectedStop') || item.id.includes('additionalStop')
      );
      layersToRemove.forEach((layer: any) => {
        view.map.layers.remove(layer);
      });
      busAreasArray.forEach((area: any) => {
        toggleBusArea(area, true);
      });
      const visibleBusAreas = busAreasArray.map((area: any) => area.geometry.coordinates);
      if (visibleBusAreas.length > 0) view.goTo(visibleBusAreas);
    }
    formDispatch({ type: 'UPDATE_SELECTED_STOPS', payload: [] });
    mapDispatch({ type: 'UPDATE_STOP_RESULTS', payload: {} });
    mapDispatch({ type: 'RESET_FORM', payload: true });
    formDispatch({ type: 'SHOW_RESULT', payload: false });
  };
  return { clearSearch };
};

export default useClearSearch;
