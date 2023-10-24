<template>
  <div class="weather">
    <div class="weatherIcon">
      <img :src="'assets/icons/' + iconType + '/' + weather.iconId + '.png'" alt="" />
    </div>
    <div class="weatherValue">
      <p>{{weather.temperature.value}} °{{weather.temperature.unit}}</p>
    </div>
    <div class="weatherDescription">
      <p>{{weather.description}}</p>
    </div>
  </div>
</template>

<script>
  import CONFIG from '../export-config';

  const KELVIN = 273.15;

  export default {
    data() {
      return {
        weather:{
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
    created() {
      setPosition().then(data => this.weather = data);
    }
  }

  function setPosition() {
    if (!CONFIG.trackLocation || !navigator.geolocation) {
      if (CONFIG.trackLocation) {
        console.error('Geolocation not available');
      }
      return getWeather(CONFIG.defaultLatitude, CONFIG.defaultLongitude);
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        pos => {
          resolve(getWeather(pos.coords.latitude.toFixed(3), pos.coords.longitude.toFixed(3)));
        },
        err => {
          console.error(err);
          resolve(getWeather(CONFIG.defaultLatitude, CONFIG.defaultLongitude));
        }
      );
    })
  }

  function getWeather(latitude, longitude) {
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
        weather.temperature.value = CONFIG.weatherUnit == 'C' ? celsius : (celsius * 9) / 5 + 32;
        weather.description = data.weather[0].description;
        weather.iconId = data.weather[0].icon;

        return weather
      })
  }

</script>