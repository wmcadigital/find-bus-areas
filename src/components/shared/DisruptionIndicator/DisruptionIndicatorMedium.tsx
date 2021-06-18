import Icon from 'components/shared/Icon/Icon';

type DisruptionIndicatorMediumProps = {
  className?: string;
  iconLeft?: string;
  narrow?: boolean;
  text?: string;
  title?: string;
};

const DisruptionIndicatorMedium = ({
  className,
  iconLeft,
  narrow,
  text,
  title,
}: DisruptionIndicatorMediumProps) => {
  return (
    <div
      className={`
        wmnds-disruption-indicator-medium wmnds-disruption-indicator-medium--purple
        ${className} ${narrow ? 'wmnds-disruption-indicator-medium--narrow' : ''}
        wmnds-disruption-indicator-medium--with-icon`}
      title={title}
    >
      {/* If iconLeft, show icon left */}
      {iconLeft && (
        <Icon
          iconName={iconLeft}
          className="wmnds-disruption-indicator-medium__icon wmnds-disruption-indicator-medium__icon--left"
        />
      )}
      {text}
    </div>
  );
};

export default DisruptionIndicatorMedium;
