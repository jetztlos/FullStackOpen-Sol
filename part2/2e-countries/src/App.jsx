import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital ? country.capital[0] : 'N/A'}</p>
      <p>Area: {country.area} km²</p>
      <h4>Languages:</h4>
      <ul>
        {country.languages 
          ? Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>) 
          : <li>No languages data</li>}
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="150" />
    </div>
  )
}

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)
  const api_key = import.meta.env.VITE_WEATHER_API_KEY

  useEffect(() => {
    if (!capital) return

    const fetchWeather = async () => {
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${api_key}`
        const response = await axios.get(url)
        setWeather(response.data)
      } catch (error) {
        console.error('Weather fetch error:', error)
        setWeather(null)
      }
    }
    fetchWeather()
  }, [capital, api_key])

  if (!weather) return <p>Loading weather...</p>

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p><strong>Temperature:</strong> {weather.main.temp} °C</p>
      <p><strong>Wind:</strong> {weather.wind.speed} m/s</p>
      {weather.weather[0] && (
        <img
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt={weather.weather[0].description}
          style={{ width: 100 }}
        />
      )}
    </div>
  )
}

const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [showCountry, setShowCountry] = useState(null)

  useEffect(() => {
    if (search === '') {
      setCountries([])
      setShowCountry(null)
      return
    }

    const fetchCountries = async () => {
      try {
        const response = await axios.get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        const filtered = response.data.filter(country =>
          country.name.common.toLowerCase().includes(search.toLowerCase())
        )
        setCountries(filtered)
        if (filtered.length === 1) {
          setShowCountry(filtered[0])
        } else {
          setShowCountry(null)
        }
      } catch (error) {
        console.error('Countries fetch error:', error)
        setCountries([])
        setShowCountry(null)
      }
    }

    fetchCountries()
  }, [search])

  const handleShowClick = (country) => {
    setShowCountry(country)
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Countries</h1>
      <div>
        Find countries: <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name"
        />
      </div>

      {showCountry ? (
        <>
          <Country country={showCountry} />
          {showCountry.capital && <Weather capital={showCountry.capital[0]} />}
        </>
      ) : (
        <>
          {countries.length > 10 && <p>Too many matches, specify another filter</p>}

          {countries.length > 1 && countries.length <= 10 && (
            <ul>
              {countries.map(country => (
                <li key={country.name.common}>
                  {country.name.common}{' '}
                  <button onClick={() => handleShowClick(country)}>show</button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}

export default App
