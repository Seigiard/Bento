<template>
  <div class="weather">
    <div class="weatherIcon">
      <img :src="svgIcon" alt="" />
    </div>
    <div class="weatherValue">
      <p>{{ weather.temperature.value }} °{{ weather.temperature.unit }}</p>
    </div>
    <div class="weatherDescription">
      <p>{{ weather.description }}</p>
    </div>
  </div>
</template>

<style>
.weather {
  display: flex;
  align-items: center;
  justify-content: center;
}

.weatherIcon {
  height: 7vmin;
}
.weatherIcon img {
  margin-top: -1vmin;
  margin-bottom: -1vmin;
  width: 9vmin;
  height: 9vmin;
}

.weatherValue p {
  font-size: var(--fg-secondary);
  font-weight: bolder;
  text-wrap: nowrap;
}

.weatherDescription p {
  font-size: var(--fg-secondary);
  margin-left: 2vmin;
}
</style>

<script>
import CONFIG from '../../config';

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

export default {
  data() {
    return {
      weather: {
        temperature: {
          unit: 'c',
          value: '-',
        },
        description: '',
        iconId: 'unknown',
      },
      iconType: CONFIG.weatherIcons,
    };
  },
  computed: {
    svgIcon() {
      return (
        'assets/icons/' +
        CONFIG.weatherIcons +
        '/' +
        SvgIconsMap[this.weather.iconId] +
        '.svg'
      );
    },
  },
  created() {
    getWeather().then((data) => (this.weather = data));
  },
};

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
</script>
