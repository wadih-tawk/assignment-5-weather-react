import { describeWeather, formatTemperature } from '../format.js';

export default function ForecastDay({ name, day }) {
  const weather = describeWeather(day.code);

  return (
    <li className="forecast-day">
      <p className="forecast-name">{name}</p>
      <img className="forecast-icon" src={`/icons/${weather.icon}.svg`} alt={weather.label} width="48" height="48" />
      <p className="forecast-temps">
        <span className="temp-max">{formatTemperature(day.max)}</span>
        <span className="temp-min">{formatTemperature(day.min)}</span>
      </p>
    </li>
  );
}
