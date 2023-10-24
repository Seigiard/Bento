<template>
  <button class="themeButton" @click="toggleTheme">
    <Icon :name="icon" class="themeIcon" />
  </button>
</template>

<script>
import CONFIG from '../export-config';

export default {
  data() {
    return {
      darkTheme: isDarkThemeEnabled()
    }
  },
  computed: {
    icon() {
      if (this.darkTheme) {
        return 'Sun';
      } else {
        return 'Moon';
      }
    }
  },
  mounted() {
    if (CONFIG.imageBackground) {
      document.body.classList.add('withImageBackground');
    }

    if (CONFIG.changeThemeByOS && CONFIG.autoChangeTheme) {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.enableDark();
      } else {
        this.disableDark();
      }
    }

    if (CONFIG.changeThemeByHour && CONFIG.autoChangeTheme && !CONFIG.changeThemeByOS) {
      const date = new Date();
      const hours = date.getHours() < 10 ? '0' + date.getHours().toString() : date.getHours().toString();
      const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes().toString() : date.getMinutes().toString();
      const currentTime = hours + ':' + minutes;
      if (currentTime >= CONFIG.hourDarkThemeActive) {
        this.enableDark();
      } else if (currentTime >= CONFIG.hourDarkThemeInactive) {
        this.disableDark();
      }
    }
  },
  methods: {
    toggleTheme() {
      if (!this.darkTheme) {
        this.enableDark();
      } else {
        this.disableDark();
      }
    },
    updateDarkThemeValue() {
      this.darkTheme = isDarkThemeEnabled();
    },
    enableDark() {
      document.body.classList.add('darktheme');
      localStorage.setItem('darkTheme', 'enabled');
      this.updateDarkThemeValue();
    },
    disableDark() {
      document.body.classList.remove('darktheme');
      localStorage.setItem('darkTheme', null);
      this.updateDarkThemeValue();
    }
  }
}

function isDarkThemeEnabled() {
  return localStorage.getItem('darkTheme') === 'enabled';
}
</script>