import { useState } from 'react';
import { useMapContext } from 'globalState';
import Button from '../Button/Button';
import Checkbox from '../Checkbox/Checkbox';
import s from './BusAreaKey.module.scss';

const BusAreaKey = () => {
  const [showKey, setShowKey] = useState(false);
  const [{ busAreas, view }, mapDispatch] = useMapContext();
  const areas = Object.keys(busAreas).map((key) => busAreas[key]);
  const handleToggle = (area: any) => {
    if (view) {
      const payload = {
        name: area.properties.area_name,
        value: !busAreas[area.properties.area_name].visible,
      };
      mapDispatch({
        type: 'TOGGLE_AREA',
        payload,
      });
      view.map.findLayerById(area.id).visible = payload.value;
    }
  };

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
        areas.map((area) => (
          <div key={area.id} className={`${s.keyIcon}`}>
            <Checkbox
              handleChange={() => handleToggle(area)}
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
