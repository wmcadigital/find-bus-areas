/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

import Icon from '../Icon/Icon';

type InputProps = {
  name: string;
  children?: React.ReactNode;
  handleChange?: (o: any) => void;
  checked: boolean;
  classes?: string;
};

const InputCheckbox = ({ name, children, handleChange, checked, classes }: InputProps) => {
  // Set input to render below

  return (
    <div className={`wmnds-fe-group ${classes}`}>
      <label className="wmnds-fe-checkboxes__container wmnds-m-none">
        {children}
        <input
          defaultChecked={checked}
          className="wmnds-fe-checkboxes__input"
          onChange={handleChange}
          name={name}
          type="checkbox"
        />
        <span className="wmnds-fe-checkboxes__checkmark">
          <Icon className="wmnds-fe-checkboxes__icon" iconName="general-checkmark" />
        </span>
      </label>
    </div>
  );
};

export default InputCheckbox;
