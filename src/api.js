const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const TIMEOUT_MS = 10000;

const CURRENT_FIELDS = 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code,is_day';
const DAILY_FIELDS = 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max';

async function getJSON(url) {
  let response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch (err) {
    throw new Error(err.name === 'TimeoutError' ? 'timeout' : 'offline', { cause: err });
  }

  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }

  try {
    return await response.json();
  } catch (err) {
    throw new Error(err.name === 'TimeoutError' ? 'timeout' : 'bad-data', { cause: err });
  }
}

export async function loadWeather(city) {
  const geoParams = new URLSearchParams({ name: city, count: 1 });
  const geo = await getJSON(`${GEO_URL}?${geoParams}`);

  if (!geo.results?.length) {
    throw new Error('not-found');
  }
  const place = geo.results[0];

  const forecastParams = new URLSearchParams({
    latitude: place.latitude,
    longitude: place.longitude,
    current: CURRENT_FIELDS,
    daily: DAILY_FIELDS,
    forecast_days: 3,
    timezone: 'auto',
  });
  const forecast = await getJSON(`${FORECAST_URL}?${forecastParams}`);

  const { current, daily } = forecast;
  if (!current || !daily?.time?.length) {
    throw new Error('bad-data');
  }

  return {
    place,
    current: {
      time: current.time,
      temperature: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      windDirection: current.wind_direction_10m,
      code: current.weather_code,
      isDay: current.is_day,
    },
    days: daily.time.map((date, i) => ({
      date,
      code: daily.weather_code[i],
      max: daily.temperature_2m_max[i],
      min: daily.temperature_2m_min[i],
      rainChance: daily.precipitation_probability_max[i],
    })),
  };
}
