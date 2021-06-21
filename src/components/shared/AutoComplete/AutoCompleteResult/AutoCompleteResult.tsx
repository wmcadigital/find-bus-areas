// Import components
import DisruptionIndicatorMedium from 'components/shared/DisruptionIndicator/DisruptionIndicatorMedium';
import { useAutoCompleteContext } from '../AutoCompleteState/AutoCompleteContext';
import s from './AutoCompleteResult.module.scss';

const AutoCompleteResult = ({
  result,
  handleKeyDown,
  onSelectResult,
}: {
  result: any;
  handleKeyDown: (e: any) => void;
  onSelectResult: any;
}) => {
  const [, autoCompleteDispatch] = useAutoCompleteContext();
  const handleClick = () => {
    autoCompleteDispatch({ type: 'UPDATE_SELECTED_ITEM', payload: result });
    if (onSelectResult) onSelectResult(result);
  };
  return (
    <li
      className={`${s.suggestions} wmnds-autocomplete-suggestions__li wmnds-grid`}
      tabIndex={0}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
      role="button"
      aria-pressed="false"
      onKeyDown={(e) => handleKeyDown(e)}
      onClick={handleClick}
    >
      <div style={{ display: 'none' }}>
        <DisruptionIndicatorMedium className="wmnds-col-auto" text={result.serviceNumber} />
      </div>
      {/* Right section */}
      <div className="wmnds-col-auto">
        <strong className={`${s.name}`}>{result.name}</strong>
      </div>
    </li>
  );
};

export default AutoCompleteResult;
