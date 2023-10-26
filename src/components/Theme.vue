<template>
  <button class="themeButton" @click="toggleTheme" :title="theme + ' theme'" aria-label="Switch Theme">
    <Icon :name="icon" class="themeIcon" />
  </button>
</template>

<script>
import CONFIG from '../export-config';
const themeSettings = {
  'light': 'Sun',
  'dark': 'Moon',
  'system': 'SunMoon'
}
const themeList = Object.keys(themeSettings)

export default {
  data() {
    return {
      html: document.documentElement,
      theme: getLocalStorageTheme()
    }
  },
  computed: {
    nextTheme() {
      const currentThemeId = themeList.indexOf(this.theme) || 0
      return themeList[(currentThemeId + 1) % themeList.length]
    },
    icon() {
      return themeSettings[this.theme]
    }
  },
  mounted() {
    if (CONFIG.imageBackground) {
      document.body.classList.add('withImageBackground');
    }

    // if (CONFIG.changeThemeByOS && CONFIG.autoChangeTheme) {
    //   if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    //     this.enableDark({ storageFirst: true });
    //   } else {
    //     this.enableLight({ storageFirst: true });
    //   }
    // }

    // if (CONFIG.changeThemeByHour && CONFIG.autoChangeTheme && !CONFIG.changeThemeByOS) {
    //   const date = new Date();
    //   const hours = date.getHours() < 10 ? '0' + date.getHours().toString() : date.getHours().toString();
    //   const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes().toString() : date.getMinutes().toString();
    //   const currentTime = hours + ':' + minutes;
    //   if (currentTime >= CONFIG.hourDarkThemeActive) {
    //     this.enableDark();
    //   } else if (currentTime >= CONFIG.hourDarkThemeInactive) {
    //     this.enableLight();
    //   }
    // }
  },
  methods: {
    toggleTheme() {
      this.setTheme(this.nextTheme)
    },
    setTheme(theme) {
      if (theme === 'system') {
        html.classList.remove('is-dark', 'is-light')
      } else if (theme === 'light') {
        html.classList.add('is-light')
        html.classList.remove('is-dark')
      } else if (theme === 'dark') {
        html.classList.add('is-dark')
        html.classList.remove('is-light')
      }
      this.updateThemeValue(theme)
    },
    updateThemeValue(value) {
      setLocalStorageTheme(value);
      this.theme = value;
    }
  }
}

function getLocalStorageTheme() {
  return localStorage.getItem('theme');
}
function setLocalStorageTheme(value) {
  localStorage.setItem('theme', value);
}
</script>