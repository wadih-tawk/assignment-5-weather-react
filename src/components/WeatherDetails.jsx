import DetailItem from './DetailItem.jsx';
import { formatPercent, formatTemperature, formatWind } from '../format.js';

export default function WeatherDetails({ current, rainChance }) {
  const details = [
    { label: 'Feels like', value: formatTemperature(current.feelsLike) },
    { label: 'Humidity', value: formatPercent(current.humidity) },
    { label: 'Wind', value: formatWind(current.windSpeed, current.windDirection) },
    { label: 'Chance of rain', value: formatPercent(rainChance) },
  ];

  return (
    <dl className="details">
      {details.map(detail => (
        <DetailItem key={detail.label} label={detail.label} value={detail.value} />
      ))}
    </dl>
  );
}
