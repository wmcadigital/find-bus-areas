import { useCallback } from 'react';
import { useMapContext } from 'globalState';

const useToggleBusAreas = () => {
  const [{ view, busAreas }, mapDispatch] = useMapContext();
  const busAreasArray = Object.keys(busAreas).map((key) => busAreas[key]);
  const toggleBusArea = useCallback(
    (area: any, visible: boolean) => {
      if (view && area.visible !== visible) {
        const payload = {
          name: area.properties.area_name,
          value: visible,
        };
        mapDispatch({
          type: 'TOGGLE_AREA',
          payload,
        });
      }
    },
    [mapDispatch, view]
  );

  return { view, busAreasArray, toggleBusArea };
};

export default useToggleBusAreas;
