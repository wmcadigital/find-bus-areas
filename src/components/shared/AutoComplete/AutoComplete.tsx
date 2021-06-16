import Icon from 'components/shared/Icon/Icon';

const AutoComplete = ({
  id,
  label,
  name,
  placeholder,
}: {
  id?: string;
  label?: string;
  name: string;
  placeholder?: string;
}) => {
  return (
    <div className="wmnds-m-b-sm">
      {label && (
        <label className="wmnds-fe-label" htmlFor={id}>
          {label}
        </label>
      )}
      <div className="wmnds-autocomplete wmnds-grid">
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
          className="wmnds-fe-input wmnds-autocomplete__input wmnds-col-1"
          type="text"
        />
      </div>
    </div>
  );
};

export default AutoComplete;
