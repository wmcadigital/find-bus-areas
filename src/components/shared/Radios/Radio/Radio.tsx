/* eslint-disable jsx-a11y/label-has-associated-control */
import dompurify from 'dompurify';

import s from './Radio.module.scss';

const { sanitize } = dompurify;

export type RadioProps = {
  name: string;
  text: string;
  value: string;
  info?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Radio = ({ name, onChange, text, value, info }: RadioProps) => {
  const defaultChecked = false;

  return (
    <>
      <label className={`${s.radioContainer} wmnds-fe-radios__container`}>
        <div className={s.text} dangerouslySetInnerHTML={{ __html: sanitize(text) }} />
        <input
          className={`${s.radio} wmnds-fe-radios__input`}
          value={value}
          name={name}
          type="radio"
          onChange={onChange}
          defaultChecked={defaultChecked}
        />
        {info && (
          <div
            className={`${s.insetText} wmnds-inset-text wmnds-m-t-xs`}
            dangerouslySetInnerHTML={{ __html: sanitize(info) }}
          />
        )}
        <span className="wmnds-fe-radios__checkmark" />
      </label>
    </>
  );
};

export default Radio;
