import dompurify from 'dompurify';
import Icon from '../Icon/Icon';

const { sanitize } = dompurify;

type MessageProps = {
  type?: string;
  title?: string;
  message?: string | Node;
  showRetry?: boolean;
  retryCallback?: () => void;
};

const Message = ({ type, title, message, showRetry = false, retryCallback }: MessageProps) => {
  let iconName;
  switch (type) {
    case 'error':
      iconName = 'warning-triangle';
      break;

    default:
      iconName = 'success';
      break;
  }

  return (
    <div
      className={`wmnds-msg-summary wmnds-msg-summary--${type} wmnds-col-1 wmnds-m-t-lg wmnds-m-b-sm`}
    >
      <div className="wmnds-msg-summary__header">
        <Icon iconName={`general-${iconName}`} className="wmnds-msg-summary__icon" />
        <h3 className="wmnds-msg-summary__title">{title}</h3>
      </div>

      <div className="wmnds-msg-summary__info">
        <p className="wmnds-m-b-sm">{message && sanitize(message)}</p>
        {showRetry && (
          <button type="button" className="wmnds-btn wmnds-btn--link" onClick={retryCallback}>
            Retry search
          </button>
        )}
      </div>
    </div>
  );
};

export default Message;
