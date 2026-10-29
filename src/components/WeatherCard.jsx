import { describeWeather, formatRegion, formatTemperature } from '../format.js';

export default function WeatherCard({ place, current }) {
  const weather = describeWeather(current.code, current.isDay);
  const region = formatRegion(place);

  return (
    <div className={current.isDay ? 'card current' : 'card current night'}>
      <h2>{place.name}</h2>
      {region !== '' && <p className="place-region">{region}</p>}
      <div className="current-main">
        <img className="current-icon" src={`/icons/${weather.icon}.svg`} alt="" width="96" height="96" />
        <p className="current-temp">{formatTemperature(current.temperature)}</p>
      </div>
      <p className="current-condition">{weather.label}</p>
    </div>
  );
}
