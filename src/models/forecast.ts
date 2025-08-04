const KELVIN = 273.15;
const DEFAULT_UNIT = 'C';

export const TTL_TIME = 1000 * 60 * 60; // 1 hour

export type ForecastDataType = {
  unit: string;
  temperature: number | string;
  description?: string | null;
  icon: string;
  hasGeolocationAccess?: boolean;
};

export const defaultValue: ForecastDataType = {
  unit: DEFAULT_UNIT,
  temperature: '--',
  description: null,
  icon: 'unknown',
  hasGeolocationAccess: true,
};

export async function getForecast({
  fallbackLatitude,
  fallbackLongitude,
  apiKey,
  language,
  unit = DEFAULT_UNIT,
}: {
  fallbackLatitude?: string;
  fallbackLongitude?: string;
  apiKey?: string;
  language?: string;
  unit?: string;
} = {}): Promise<ForecastDataType | undefined> {
  async function getDefaultLocationForesast() {
    if (fallbackLatitude && fallbackLongitude) {
      console.error('Geolocation not available. Fetching default location.');
      const data = await fetchAndParseForecastData({
        latitude: fallbackLatitude,
        longitude: fallbackLongitude,
        apiKey,
        language,
        unit,
      });
      if (data) {
        data.hasGeolocationAccess = false;
      }
      return data;
    } else {
      console.error('Geolocation not available. No default location set.');
      return {
        ...defaultValue,
        hasGeolocationAccess: false,
      };
    }
  }

  try {
    const { latitude, longitude } = await getCurrentPosition();

    if (latitude && longitude) {
      const data = await fetchAndParseForecastData({
        latitude,
        longitude,
        apiKey,
        language,
        unit,
      });
      if (data) {
        data.hasGeolocationAccess = true;
      }
      return data;
    }

    return getDefaultLocationForesast();
  } catch (_e) {
    return getDefaultLocationForesast();
  }
}

export async function getCurrentPosition(): Promise<{
  latitude: string;
  longitude: string;
}> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject('Geolocation not available');
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude.toFixed(3),
          longitude: pos.coords.longitude.toFixed(3),
        });
      },
      (err) => {
        reject(err);
      },
    );
  });
}

async function fetchAndParseForecastData({
  latitude,
  longitude,
  apiKey,
  language,
  unit,
}: {
  latitude: string;
  longitude: string;
  apiKey?: string;
  language?: string;
  unit?: string;
}): Promise<ForecastDataType | undefined> {
  if (!apiKey) {
    console.error('No API key provided for weather forecast');
    return undefined;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&lang=${language}&appid=${apiKey}`;
  return fetch(url)
    .then((r) => {
      if (!r.ok) {
        throw new Error(`Weather API error: ${r.status}`);
      }
      return r.json();
    })
    .then((data) => parseForecastData(data, unit))
    .catch((error) => {
      console.error('Error fetching weather data:', error);
      return undefined;
    });
}

function parseForecastData(data, unit = DEFAULT_UNIT): ForecastDataType {
  try {
    const weather = {} as ForecastDataType;
    let celsius = Math.floor(data.main.temp - KELVIN);

    weather.unit = unit;
    weather.temperature = unit == 'C' ? celsius : (celsius * 9) / 5 + 32;
    weather.description = data.weather?.[0]?.description;
    weather.icon = data.weather?.[0]?.icon ?? 'unknown';
    weather.hasGeolocationAccess = true;

    return weather;
  } catch (error) {
    console.error('Error parsing weather data:', error);
    return defaultValue;
  }
}
