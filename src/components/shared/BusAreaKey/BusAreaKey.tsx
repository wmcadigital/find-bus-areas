import { useState } from 'react';
import useToggleBusAreas from 'globalState/customHooks/useToggleBusAreas';
import Button from '../Button/Button';
import Checkbox from '../Checkbox/Checkbox';
import s from './BusAreaKey.module.scss';

const BusAreaKey = () => {
  const [showKey, setShowKey] = useState(false);
  const { view, busAreasArray, toggleBusArea } = useToggleBusAreas();

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
      {view &&
        showKey &&
        busAreasArray.map((area: any) => (
          <div key={area.id} className={`${s.keyIcon}`}>
            <Checkbox
              handleChange={() => toggleBusArea(area, !area.visible)}
              checked={area.visible}
              classes="wmnds-m-none"
              name="area_toggle"
            >
              {area.properties.area_name}
            </Checkbox>
            <div className={s.keyBorder} style={{ borderColor: `rgb(${area.color})` }} />
          </div>
        ))}
    </div>
  );
};

export default BusAreaKey;
