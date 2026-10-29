import ForecastDay from './ForecastDay.jsx';
import { formatDay } from '../format.js';

export default function Forecast({ days }) {
  return (
    <section className="card forecast">
      <h3>{days.length}-day forecast</h3>
      <ol className="forecast-list">
        {days.map((day, index) => (
          <ForecastDay key={day.date} name={formatDay(day.date, index)} day={day} />
        ))}
      </ol>
    </section>
  );
}
