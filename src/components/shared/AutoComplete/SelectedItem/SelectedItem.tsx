import { useRef } from 'react';
// Imported components
import CloseButton from './CloseButton/CloseButton';
import s from './SelectedItem.module.scss';
import { useAutoCompleteContext } from '../AutoCompleteState/AutoCompleteContext';

const SelectedItem = ({ onClearSelection }: { onClearSelection?: any }) => {
  const selectedItemRef = useRef(null);
  const [{ selectedItem }, autoCompleteDispatch] = useAutoCompleteContext();

  const handleClear = () => {
    autoCompleteDispatch({ type: 'REMOVE_SELECTED_ITEM' });
    if (onClearSelection) onClearSelection();
  };

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
