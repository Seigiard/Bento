import CONFIG from '../config';

const KELVIN = 273.15;

export type ForecastDataType = {
  unit: string;
  temperature: number | string;
  description?: string | null;
  icon: string;
};

export const defaultValue: ForecastDataType = {
  unit: CONFIG.weatherUnit,
  temperature: '--',
  description: null,
  icon: 'unknown',
};

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

async function fetchAndParseForecastData(latitude: string, longitude: string) {
  return fetchWeatherData(latitude, longitude)
    .then(parseForecastData)
}

async function fetchWeatherData(latitude: string, longitude: string) {
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
  weather.icon = data.weather[0].icon ?? 'unknown';

  return weather;
}
