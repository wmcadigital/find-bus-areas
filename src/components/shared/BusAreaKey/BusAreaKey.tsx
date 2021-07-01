import { useState } from 'react';
import Button from '../Button/Button';
import Checkbox from '../Checkbox/Checkbox';
import s from './BusAreaKey.module.scss';

const BusAreaKey = () => {
  const [showKey, setShowKey] = useState(true);
  const areas = [
    { name: 'West Midlands', color: '#c96c08' },
    { name: 'Black Country', color: '#000000' },
    { name: 'Sandwell and Dudley', color: '#741372' },
  ];
  return (
    <div className={s.mapKeyContainer}>
      <div className={s.keyHeader}>
        <p className="h4 wmnds-m-none">Bus area key</p>
        <Button
          text={showKey ? 'Hide' : 'Show'}
          btnClass={`${s.hideKeyBtn} wmnds-btn--link`}
          onClick={() => setShowKey(!showKey)}
        />
      </div>
      {showKey &&
        areas.map((area) => (
          <div key={area.name} className={`${s.keyIcon}`}>
            <Checkbox checked={false} classes="wmnds-m-none" name="area_toggle">
              {area.name}
            </Checkbox>
            <div className={s.keyBorder} style={{ borderColor: area.color }} />
          </div>
        ))}
    </div>
  );
};

export default BusAreaKey;
