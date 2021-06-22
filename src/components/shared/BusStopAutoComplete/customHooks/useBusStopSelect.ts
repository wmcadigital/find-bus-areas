import { useFormContext } from 'globalState';

const useBusStopSelect = () => {
  const [{ selectedStops }, formDispatch] = useFormContext();

  const onBusStopSelect = (id: string, location: any, selectedStop: any) => {
    const stopToAdd = {
      autoCompleteId: id,
      selectedLocation: location,
      ...selectedStop,
    };
    const payload = selectedStops;
    let index;
    if (selectedStops.find((stop) => stop.autoCompleteId === id)) {
      selectedStops.find((stop, i) => {
        index = i;
        return stop.autoCompleteId === id;
      });
    }
    if (index === undefined) {
      payload.push(stopToAdd);
    } else {
      payload[index] = stopToAdd;
    }
    formDispatch({ type: 'UPDATE_SELECTED_STOPS', payload });
  };

  return { onBusStopSelect };
};

export default useBusStopSelect;
