import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import Input from './components/Input';

function App() {
  const [degrees, setDegrees] = useState(null);
  const [location, setLocation] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [humidity, setHumidity] = useState(null);
  const [wind, setWind] = useState(null);
  const [countryCode, setCountryCode] = useState('');
  const [countryName, setCountryName] = useState('');
  const [dataFetched, setDataFetched] = useState(false);
  const [currentDate, setCurrentDate] = useState('');

  const fetchData = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${userLocation}&appid=${process.env.REACT_APP_API_KEY}&units=metric`);
      const data = await res.data;

      setDegrees(data.main.temp);
      setLocation(data.name);
      setDescription(data.weather[0].description);
      setIcon(data.weather[0].icon);
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setCountryCode(data.sys.country);

      setDataFetched(true);
    } catch (err) {
      console.log(err);
      alert('Please enter a valid location');
    }
  };

  const defaultDataFetched = async () => {
    if (!dataFetched) {
      const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=accra&appid=${process.env.REACT_APP_API_KEY}&units=metric`);
      const data = await res.data;

      setDegrees(data.main.temp);
      setLocation(data.name);
      setDescription(data.weather[0].description);
      setIcon(data.weather[0].icon);
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setCountryCode(data.sys.country);
    }
  };

  useEffect(() => {
    defaultDataFetched();

    setCurrentDate(getCurrentDate());

    if (countryCode) {
      fetchCountryName(countryCode);
    }
  }, [countryCode]); 

  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleString();
  };

  const fetchCountryName = async (code) => {
    try {
      const res = await axios.get(`https://restcountries.com/v3.1/alpha/${code}`);
      const data = await res.data;

      if (data && data[0] && data[0].name) {
        setCountryName(data[0].name.common);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App">
      <div className="weather">
        <Input
          text={(e) => setUserLocation(e.target.value)}
          submit={fetchData}
          func={fetchData}
        />

        <div className="weather_display">
          <h3 className="weather_location">Weather in {location}</h3>

          <div>
            <h1 className="weather_degrees">{degrees} °C</h1>
          </div>

          <div className="weather_description">
            <div>
              <div className="weather_description_head">
                <span className="weather_icon">
                  <img src={`http://openweathermap.org/img/w/${icon}.png`} alt="weather icon" />
                </span>
                <h3>{description}</h3>
              </div>

              <h3><b>Humidity: </b>{humidity}%</h3>
              <h3><b>Wind speed: </b>{wind} m/s</h3>
            </div>

            <div className="weather_country">
              <h3><b>{countryName}</b></h3>
              <h3 className="weather_date"><b>{currentDate}</b></h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
