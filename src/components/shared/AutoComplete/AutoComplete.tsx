import React, { useRef, useEffect } from 'react';
import Icon from 'components/shared/Icon/Icon';
import {
  AutoCompleteProvider,
  useAutoCompleteContext,
} from './AutoCompleteState/AutoCompleteContext';
import AutoCompleteResult from './AutoCompleteResult/AutoCompleteResult';
import useHandleAutoCompleteKeys from './customHooks/useHandleAutoCompleteKeys';
import SelectedItem from './SelectedItem/SelectedItem';

type AutoCompleteProps = {
  id?: string;
  label?: string;
  name: string;
  placeholder?: string;
  className?: string;
  type?: 'text' | 'number';
  onUpdate: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectResult: (event: React.ChangeEvent<HTMLInputElement>) => void;
  results?: any[] | null;
  initialValue?: string;
  initialItem?: any;
  errorMessage?: any;
  loading?: boolean;
};

const AutoComplete = ({
  id,
  label,
  name,
  placeholder,
  className,
  type = 'text',
  results,
  onUpdate,
  onSelectResult,
  initialValue,
  initialItem,
  loading,
  errorMessage,
}: AutoCompleteProps) => {
  const resultsList = useRef(null);
  const inputRef = useRef(null);
  const [{ mounted, selectedItem, query }, autoCompleteDispatch] = useAutoCompleteContext();
  // Import handleKeyDown function from customHook (used by all modes)
  const { handleKeyDown } = useHandleAutoCompleteKeys(resultsList, inputRef, results);

  useEffect(() => {
    if (!mounted) {
      autoCompleteDispatch({ type: 'MOUNT_COMPONENT', payload: true });
      if (initialValue) autoCompleteDispatch({ type: 'UPDATE_QUERY', payload: initialValue });
      if (initialItem) autoCompleteDispatch({ type: 'UPDATE_SELECTED_ITEM', payload: initialItem });
    }
    return autoCompleteDispatch({ type: 'MOUNT_COMPONENT', payload: false });
  }, [mounted, initialItem, initialValue, autoCompleteDispatch]);

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
      {selectedItem ? (
        <SelectedItem />
      ) : (
        <>
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
              value={query}
              onChange={handleChange}
              onKeyDown={(e) => handleKeyDown(e)}
              ref={inputRef}
            />
          </div>
          {/* If there is no data.length(results) and the user hasn't submitted a query and the state isn't loading then the user should be displayed with no results message, else show results */}
          {results && (
            <>
              {!results.length && query.length && !loading
                ? errorMessage
                : // Only show autocomplete results if there is a query
                  query.length > 0 && (
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
  className,
  type,
  onUpdate,
  onSelectResult,
  results,
  errorMessage,
  loading,
  initialValue,
  initialItem,
}: AutoCompleteProps) => {
  return (
    <AutoCompleteProvider>
      <AutoComplete
        id={id}
        label={label}
        name={name}
        placeholder={placeholder}
        className={className}
        type={type}
        onUpdate={onUpdate}
        onSelectResult={onSelectResult}
        results={results}
        initialValue={initialValue}
        errorMessage={errorMessage}
        loading={loading}
        initialItem={initialItem}
      />
    </AutoCompleteProvider>
  );
};

export default ContextWrapper;
