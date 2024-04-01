import CONFIG from '../config';
import { LocalStorageConnector } from './localStorage';
const LOCAL_STORAGE_KEY = 'forecastData';

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

type ForecastDataType = {
  unit: string;
  temperature: number | string;
  description?: string | null;
  icon: string;
};

const lsData = new LocalStorageConnector(LOCAL_STORAGE_KEY);

export const defaultValue: ForecastDataType = {
  unit: CONFIG.weatherUnit,
  temperature: '--',
  description: null,
  icon: getForecastIconSrc('unknown'),
};

export const initialValue: ForecastDataType = lsData.get(defaultValue);

export function getForecast(): Promise<ForecastDataType> {
  if (!CONFIG.trackLocation || !navigator.geolocation) {
    if (CONFIG.trackLocation) {
      console.error('Geolocation not available');
    }
    return fetchAndParseForecastData(
      CONFIG.defaultLatitude,
      CONFIG.defaultLongitude
    );
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve(
          fetchAndParseForecastData(
            pos.coords.latitude.toFixed(3),
            pos.coords.longitude.toFixed(3)
          )
        );
      },
      (err) => {
        console.error(err);
        resolve(
          fetchAndParseForecastData(
            CONFIG.defaultLatitude,
            CONFIG.defaultLongitude
          )
        );
      }
    );
  });
}

function fetchAndParseForecastData(latitude, longitude) {
  return fetchWeatherData(latitude, longitude)
    .then(parseForecastData)
    .then(saveForecastData);
}

function fetchWeatherData(latitude, longitude) {
  let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&lang=${CONFIG.language}&appid=${CONFIG.weatherKey}`;
  return fetch(api).then(function (response) {
    let data = response.json();
    return data;
  });
}

function parseForecastData(data): ForecastDataType {
  const weather = {} as ForecastDataType;
  let celsius = Math.floor(data.main.temp - KELVIN);

  weather.unit = CONFIG.weatherUnit;
  weather.temperature =
    CONFIG.weatherUnit == 'C' ? celsius : (celsius * 9) / 5 + 32;
  weather.description = data.weather[0].description;
  weather.icon = getForecastIconSrc(data.weather[0].icon);

  return weather;
}

function saveForecastData(data) {
  lsData.set(data);
  return data;
}

function getForecastIconSrc(iconId) {
  const icon = SvgIconsMap[iconId] ?? 'unknown';
  return 'assets/icons/' + CONFIG.weatherIcons + '/' + icon + '.svg';
}
