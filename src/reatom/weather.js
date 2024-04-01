import CONFIG from '../config';

import { atom, onConnect } from '@reatom/framework';
import { ctx } from './context';

const weatherData = atom({}, 'weatherData');
const weatherUnit = atom(CONFIG.weatherUnit, 'weatherUnit');
const weatherValue = atom('--', 'weatherValue');
const weatherDescription = atom('', 'weatherDescription');
const weatherIconId = atom('unknown', 'weatherIconId');

const weatherIcon = atom(
  (ctx) =>
    'assets/icons/' +
    CONFIG.weatherIcons +
    '/' +
    SvgIconsMap[ctx.get(weatherIconId)] +
    '.svg',
  'weatherIcon'
);

onConnect(weatherData, (ctx) => {
  getWeather().then((weather) => {
    weatherData(ctx, weather);
  });
});

ctx.subscribe(weatherData, (data) => {
  weatherUnit(ctx, data?.temperature?.unit);
  weatherValue(ctx, data?.temperature?.value);
  weatherDescription(ctx, data?.description);
  weatherIconId(ctx, data?.iconId ?? 'unknown');
});

const SvgIconsMap = {
  unknown: 'not-available',
  '01d': 'clear-day',
  '01n': 'clear-night', // clear sky
  '02d': 'partly-cloudy-day',
  '02n': 'partly-cloudy-day', // few clouds
  '03d': 'cloudy',
  '03n': 'cloudy', // scattered clouds
  '04d': 'overcast',
  '04n': 'overcast', // broken clouds
  '09d': 'rain',
  '09n': 'rain', // shower rain
  '10d': 'partly-cloudy-day-drizzle',
  '10n': 'partly-cloudy-night-drizzle', // rain
  '11d': 'thunderstorms-day',
  '11n': 'thunderstorms-night', // thunderstorm
  '13d': 'partly-cloudy-day-snow',
  '13n': 'partly-cloudy-night-snow', // snow
  '50d': 'fog-day',
  '50n': 'fog-night', // mist
};

const KELVIN = 273.15;

function getWeather() {
  if (!CONFIG.trackLocation || !navigator.geolocation) {
    if (CONFIG.trackLocation) {
      console.error('Geolocation not available');
    }
    return fetchWeatherData(CONFIG.defaultLatitude, CONFIG.defaultLongitude);
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve(
          fetchWeatherData(
            pos.coords.latitude.toFixed(3),
            pos.coords.longitude.toFixed(3)
          )
        );
      },
      (err) => {
        console.error(err);
        resolve(
          fetchWeatherData(CONFIG.defaultLatitude, CONFIG.defaultLongitude)
        );
      }
    );
  });
}

function fetchWeatherData(latitude, longitude) {
  let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&lang=${CONFIG.language}&appid=${CONFIG.weatherKey}`;
  return fetch(api)
    .then(function (response) {
      let data = response.json();
      return data;
    })
    .then(function (data) {
      const weather = {};
      let celsius = Math.floor(data.main.temp - KELVIN);
      weather.temperature = {
        unit: CONFIG.weatherUnit,
      };
      weather.temperature.value =
        CONFIG.weatherUnit == 'C' ? celsius : (celsius * 9) / 5 + 32;
      weather.description = data.weather[0].description;
      weather.iconId = data.weather[0].icon;

      return weather;
    });
}

export { weatherUnit, weatherValue, weatherDescription, weatherIcon };
