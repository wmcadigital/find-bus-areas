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
  return (
    <li
      className="wmnds-autocomplete-suggestions__li"
      tabIndex={0}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
      role="button"
      aria-pressed="false"
      onKeyDown={(e) => handleKeyDown(e)}
      onClick={onSelectResult(result)}
    >
      {/* Right section */}
      <strong className={`${s.name}`}>{result.name}</strong>
    </li>
  );
};

export default AutoCompleteResult;
