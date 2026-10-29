import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import SearchBar from './components/SearchBar.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';
import WeatherCard from './components/WeatherCard.jsx';
import WeatherDetails from './components/WeatherDetails.jsx';
import Forecast from './components/Forecast.jsx';
import Footer from './components/Footer.jsx';
import { loadWeather } from './api.js';
import { formatLocalTime, friendlyMessage } from './format.js';

export default function App() {
  const [city, setCity] = useState('');
  const [status, setStatus] = useState('idle');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status !== 'loading') {
      return;
    }

    let ignore = false;

    async function load() {
      try {
        const data = await loadWeather(city);
        if (!ignore) {
          setWeather(data);
          setStatus('success');
        }
      } catch (err) {
        if (!ignore) {
          setError(err);
          setStatus('error');
        }
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [city, status]);

  function handleSearch(newCity) {
    setCity(newCity);
    setStatus('loading');
  }

  function handleRetry() {
    setStatus('loading');
  }

  return (
    <>
      <main className="app">
        <Header />
        <SearchBar onSearch={handleSearch} isLoading={status === 'loading'} />

        <div aria-live="polite">
          {status === 'idle' && (
            <p className="status">Search for a city to see its current weather and a 3-day forecast.</p>
          )}
          {status === 'loading' && <LoadingSpinner message={`Loading the weather for ${city}…`} />}
          {status === 'error' && (
            <ErrorMessage
              message={friendlyMessage(error, city)}
              onRetry={error.message === 'not-found' ? null : handleRetry}
            />
          )}
          {status === 'success' && (
            <p className="status">Updated {formatLocalTime(weather.current.time)} local time.</p>
          )}
        </div>

        {status === 'success' && (
          <section className="weather">
            <WeatherCard place={weather.place} current={weather.current} />
            <WeatherDetails current={weather.current} rainChance={weather.days[0].rainChance} />
            <Forecast days={weather.days} />
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
