import dayjs from 'dayjs';

const WEATHER_CODES = {
  0: { label: 'Clear sky', icon: 'clear-day' },
  1: { label: 'Mainly clear', icon: 'clear-day' },
  2: { label: 'Partly cloudy', icon: 'partly-cloudy-day' },
  3: { label: 'Overcast', icon: 'cloudy' },
  45: { label: 'Fog', icon: 'fog' },
  48: { label: 'Freezing fog', icon: 'fog' },
  51: { label: 'Light drizzle', icon: 'drizzle' },
  53: { label: 'Drizzle', icon: 'drizzle' },
  55: { label: 'Heavy drizzle', icon: 'drizzle' },
  56: { label: 'Freezing drizzle', icon: 'drizzle' },
  57: { label: 'Heavy freezing drizzle', icon: 'drizzle' },
  61: { label: 'Light rain', icon: 'rain' },
  63: { label: 'Rain', icon: 'rain' },
  65: { label: 'Heavy rain', icon: 'rain' },
  66: { label: 'Freezing rain', icon: 'rain' },
  67: { label: 'Heavy freezing rain', icon: 'rain' },
  71: { label: 'Light snow', icon: 'snow' },
  73: { label: 'Snow', icon: 'snow' },
  75: { label: 'Heavy snow', icon: 'snow' },
  77: { label: 'Snow grains', icon: 'snow' },
  80: { label: 'Light showers', icon: 'rain' },
  81: { label: 'Showers', icon: 'rain' },
  82: { label: 'Violent showers', icon: 'rain' },
  85: { label: 'Snow showers', icon: 'snow' },
  86: { label: 'Heavy snow showers', icon: 'snow' },
  95: { label: 'Thunderstorm', icon: 'thunder' },
  96: { label: 'Thunderstorm with hail', icon: 'thunder' },
  99: { label: 'Thunderstorm with heavy hail', icon: 'thunder' },
};

const NIGHT_ICONS = {
  'clear-day': 'clear-night',
  'partly-cloudy-day': 'partly-cloudy-night',
};

const UNKNOWN_WEATHER = { label: 'Unknown conditions', icon: 'cloudy' };

const COMPASS_POINTS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

export function cleanCityName(text) {
  return text
    .split(' ')
    .filter(word => word !== '')
    .join(' ');
}

export function describeWeather(code, isDay = true) {
  const weather = WEATHER_CODES[code] || UNKNOWN_WEATHER;
  const icon = isDay ? weather.icon : (NIGHT_ICONS[weather.icon] || weather.icon);
  return { label: weather.label, icon };
}

export function formatTemperature(value) {
  if (typeof value !== 'number') {
    return '—';
  }
  return `${Math.round(value)}°C`;
}

export function formatPercent(value) {
  if (typeof value !== 'number') {
    return '—';
  }
  return `${Math.round(value)}%`;
}

function compassPoint(degrees) {
  return COMPASS_POINTS[Math.round(degrees / 45) % 8];
}

export function formatWind(speed, degrees) {
  if (typeof speed !== 'number') {
    return '—';
  }
  const kmh = Math.round(speed);
  if (kmh === 0) {
    return 'Calm';
  }
  return `${kmh} km/h ${compassPoint(degrees)}`;
}

export function formatDay(isoDate, index) {
  if (index === 0) {
    return 'Today';
  }
  if (index === 1) {
    return 'Tomorrow';
  }
  return dayjs(isoDate).format('dddd');
}

export function formatLocalTime(isoDateTime) {
  if (typeof isoDateTime !== 'string') {
    return '—';
  }
  return isoDateTime.split('T')[1];
}

export function formatRegion(place) {
  return [place.admin1, place.country]
    .filter(part => part && part !== place.name)
    .join(', ');
}

export function friendlyMessage(err, city) {
  if (err.message === 'not-found') {
    return `No place called "${city}" was found. Check the spelling, or try the English name.`;
  }
  if (err.message === 'offline') {
    return "Couldn't reach the weather service. Check your internet connection, then try again.";
  }
  if (err.message === 'timeout') {
    return 'The weather service took too long to answer. Try again in a moment.';
  }
  if (err.status === 429) {
    return 'Too many searches in a short time. Wait a minute, then try again.';
  }
  if (err.status >= 500) {
    return 'The weather service is having problems right now. Try again in a few minutes.';
  }
  if (err.message === 'bad-data') {
    return "The weather service sent an answer we couldn't read. A work or school network may be blocking it.";
  }
  return 'Something went wrong while loading the weather. Try again.';
}
