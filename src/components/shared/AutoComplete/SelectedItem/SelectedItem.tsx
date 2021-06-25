import { useRef, useEffect } from 'react';
// Imported components
import CloseButton from './CloseButton/CloseButton';
import s from './SelectedItem.module.scss';
import { useAutoCompleteContext } from '../AutoCompleteState/AutoCompleteContext';

type SelectedItemProps = {
  selectedItem: { name: string; indicatorText?: string; [key: string]: any };
  onClearSelection?: any;
};

const SelectedItem = ({ selectedItem, onClearSelection }: SelectedItemProps) => {
  const selectedItemRef = useRef(null);
  const [, autoCompleteDispatch] = useAutoCompleteContext();

  const handleClear = () => {
    autoCompleteDispatch({ type: 'UPDATE_QUERY', payload: '' });
    if (onClearSelection) onClearSelection();
  };

  // Clear query on unmount
  useEffect(() => {
    return autoCompleteDispatch({ type: 'UPDATE_QUERY', payload: '' });
  }, [autoCompleteDispatch]);

  return (
    <>
      {/* Close disruption box */}
      <div
        className={`wmnds-grid wmnds-grid--justify-between wmnds-m-t-xs wmnds-m-b-md ${s.selectedItemBox}`}
        ref={selectedItemRef}
      >
        <strong className={`wmnds-col-auto ${s.selectedSummary}`}>{selectedItem.name}</strong>
        <CloseButton onClick={handleClear} />
      </div>
    </>
  );
};

export default SelectedItem;
