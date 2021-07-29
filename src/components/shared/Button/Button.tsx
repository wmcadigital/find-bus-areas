// Import packages
import s from './Button.module.scss';
import Icon from '../Icon/Icon';
import { ReplaceTextWithIcon } from '../Icon/NIcon';

type ButtonProps = {
  btnClass?: string;
  disabled?: boolean;
  iconLeft?: string;
  iconRight?: string;
  isActive?: boolean;
  isFetching?: boolean;
  onClick?: any;
  text: string;
  title?: string;
  type?: 'button' | 'submit' | 'reset';
};

const Button = ({
  btnClass,
  disabled,
  iconLeft,
  iconRight,
  isActive,
  isFetching,
  onClick,
  text,
  title,
  type = 'button',
}: ButtonProps) => {
  return (
    <button
      // eslint-disable-next-line react/button-has-type
      type={type}
      title={title}
      className={`wmnds-btn ${btnClass} ${isActive ? 'wmnds-is--active' : ''} ${
        iconRight ? s.iconRight : ''
      } ${disabled ? 'wmnds-btn--disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {/* If icon left is set then call icon component and inject correct svg */}
      {iconLeft ? <Icon className="wmnds-btn__icon" iconName={iconLeft} /> : null}

      {/* button text will go here, if any */}
      <ReplaceTextWithIcon htmlElement={text} />

      {/* If API is fetching show spinner on button */}
      {isFetching ? (
        <div
          className="wmnds-loader wmnds-loader--btn wmnds-btn__icon wmnds-btn__icon--right"
          role="alert"
          aria-live="assertive"
        >
          <p className="wmnds-loader__content">Content is loading...</p>
        </div>
      ) : (
        /* If icon right is set then call icon component and inject correct svg */
        iconRight && (
          <Icon className="wmnds-btn__icon wmnds-btn__icon--right" iconName={iconRight} />
        )
      )}
    </button>
  );
};

export default Button;
