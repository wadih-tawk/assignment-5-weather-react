import { useState } from 'react';
import { cleanCityName } from '../format.js';

function validate(city) {
  if (city === '') {
    return 'Type a city name first.';
  }
  if (Number.isFinite(Number(city))) {
    return 'That looks like a number. Type a city name, for example Beirut.';
  }
  return '';
}

export default function SearchBar({ onSearch, isLoading }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  function handleChange(e) {
    setText(e.target.value);
    if (error !== '') {
      setError(validate(cleanCityName(e.target.value)));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const city = cleanCityName(text);
    const found = validate(city);
    setError(found);
    if (found !== '') {
      return;
    }
    onSearch(city);
  }

  return (
    <form className="card search" role="search" onSubmit={handleSubmit}>
      <label htmlFor="city-input">City</label>
      <div className="search-row">
        <input
          id="city-input"
          className={error !== '' ? 'invalid' : ''}
          type="search"
          value={text}
          onChange={handleChange}
          maxLength={100}
          autoComplete="off"
          placeholder="e.g. Beirut"
          aria-describedby="city-hint"
          aria-invalid={error !== ''}
          autoFocus
        />
        <button className="button" type="submit" disabled={isLoading}>
          Search
        </button>
      </div>
      {error !== '' && <p className="field-error" role="alert">{error}</p>}
      <p className="hint" id="city-hint">Same name in two countries? Add the country: Tripoli, Lebanon</p>
    </form>
  );
}
