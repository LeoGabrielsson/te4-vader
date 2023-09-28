import { useEffect, useState } from 'react'
import './App.css'
import Spinner from './components/spinner'

function App() {
  const [lat, setLat] = useState(0)
  const [long, setLong] = useState(0)
  const [weatherData, setWData] = useState([])


  useEffect(() => {
    // 1. Get location from browser
    // 2. Check if location is the same as last time
    // 3. If location is the same as last time, use data from localstorage
    // 4. IF data is older than 10 minutes, fetch new data
    // 5. If location is not the same as last time, fetch new data
    // 6. Save data to localstorage


    async function fetchWeather() {

      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude)
        setLong(position.coords.longitude)
        localStorage.setItem('pastCoords', [lat, long])
        localStorage.setItem('currentCoords', [lat, long])
      })

      console.log('before fetch: ' + lat, long)

      if (lat === 0 || long === 0) {
        setWData([])
        return
      }
      const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?'
      await fetch(`${baseUrl}lat=${lat}&lon=${long}&appid=${import.meta.env.VITE_API_KEY}`)
        .then(res => res.json())
        .then(result => {
          console.log(result)
          setWData(result)
          localStorage.setItem('weather', result)
        }).catch(err => {
          console.log(err)
        })
    }
    fetchWeather()
  }, [lat, long])

  return (
    <>
      <h1>Temperature Palpatine</h1>
      <div className='dataText'>
        {weatherData.main ? (
          <>
            <h2>City: {weatherData.name}</h2>
            <h2>Temp: {(weatherData.main.temp - 273.15).toFixed(2)} degrees C</h2>
            <h2>Cords: {localStorage.getItem('currentCoords')}</h2>
          </>
        ) : (
          <Spinner />
        )}
      </div>
    </>
  )
}

export default App
