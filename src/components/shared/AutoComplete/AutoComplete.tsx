import React, { useRef } from 'react';
import Icon from 'components/shared/Icon/Icon';
import {
  AutoCompleteProvider,
  useAutoCompleteContext,
} from './AutoCompleteState/AutoCompleteContext';
import AutoCompleteResult from './AutoCompleteResult/AutoCompleteResult';
import useHandleAutoCompleteKeys from './customHooks/useHandleAutoCompleteKeys';

type AutoCompleteProps = {
  id?: string;
  label?: string;
  name: string;
  placeholder?: string;
  className?: string;
  type?: 'text' | 'number';
  onUpdate: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectResult: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  results?: any[] | null;
  errorMessage?: any;
  loading?: boolean;
};

const AutoComplete = ({
  id,
  label,
  name,
  placeholder,
  value,
  className,
  type = 'text',
  results,
  onUpdate,
  onSelectResult,
  loading,
  errorMessage,
}: AutoCompleteProps) => {
  const resultsList = useRef(null);
  const inputRef = useRef(null);
  const [autoCompleteState, autoCompleteDispatch] = useAutoCompleteContext();
  // Import handleKeyDown function from customHook (used by all modes)
  const { handleKeyDown } = useHandleAutoCompleteKeys(resultsList, inputRef, results);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    autoCompleteDispatch({
      type: 'UPDATE_QUERY',
      payload: e.target.value,
    });
    onUpdate(e);
  };
  return (
    <div className="wmnds-m-b-sm">
      {label && (
        <label className="wmnds-fe-label" htmlFor={id}>
          {label}
        </label>
      )}
      <div className={`wmnds-autocomplete wmnds-grid ${loading ? 'wmnds-is--loading' : ''}`}>
        <Icon iconName="general-search" className="wmnds-autocomplete__icon" />
        <div className="wmnds-loader" role="alert" aria-live="assertive">
          <p className="wmnds-loader__content">Content is loading...</p>
        </div>
        <input
          id={id}
          name={name}
          autoComplete="off"
          placeholder={placeholder}
          aria-label={placeholder}
          className={`wmnds-fe-input wmnds-autocomplete__input wmnds-col-1 ${className}`}
          type={type}
          value={autoCompleteState.query}
          onChange={handleChange}
          onKeyDown={(e) => handleKeyDown(e)}
          ref={inputRef}
        />
      </div>
      {/* If there is no data.length(results) and the user hasn't submitted a query and the state isn't loading then the user should be displayed with no results message, else show results */}
      {results && (
        <>
          {!results.length && value.length && !loading
            ? errorMessage
            : // Only show autocomplete results if there is a query
              value.length > 0 && (
                <ul className="wmnds-autocomplete-suggestions" ref={resultsList}>
                  {results.map((result: any) => (
                    <AutoCompleteResult
                      key={result.id}
                      result={result}
                      handleKeyDown={handleKeyDown}
                      onSelectResult={onSelectResult}
                    />
                  ))}
                </ul>
              )}
        </>
      )}
    </div>
  );
};

const ContextWrapper = ({
  id,
  label,
  name,
  placeholder,
  value,
  className,
  type = 'text',
  onUpdate,
  onSelectResult,
  results,
  errorMessage,
  loading,
}: AutoCompleteProps) => {
  return (
    <AutoCompleteProvider>
      <AutoComplete
        id={id}
        label={label}
        name={name}
        placeholder={placeholder}
        value={value}
        className={className}
        type={type}
        onUpdate={onUpdate}
        onSelectResult={onSelectResult}
        results={results}
        errorMessage={errorMessage}
        loading={loading}
      />
    </AutoCompleteProvider>
  );
};

export default ContextWrapper;
