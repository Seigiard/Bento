import { persistentMap } from "@nanostores/persistent"

export type SettingsValue = {
  theme: 'dark' | 'light' | 'system'
  name: string
  greetingMorning: string
  greetingAfternoon: string
  greetingEvening: string
  greetingNight: string
  weatherKey: string
  weatherUnit: 'F' | 'C'
  weatherDefaultLatitude: string
  weatherDefaultLongitude: string
  weatherLanguage: string
  raindropApiKey: string
  raindropCollection: string
  ouraApiKey: string
}

export const $settings = persistentMap<SettingsValue>('settings:', {
  theme: 'system',

  name: '',

  // Greetings
  greetingMorning: 'Good morning',
  greetingAfternoon: 'Good afternoon',
  greetingEvening: 'Good evening',
  greetingNight: 'Go to Sleep',

  // Weather
  weatherKey: '9e2df1fb216a5477f862b69f1732af0c', // Write here your API Key
  weatherUnit: 'C', // 'F', 'C'
  weatherDefaultLatitude: '48.160570069000705',
  weatherDefaultLongitude: '17.149771267456032',
  weatherLanguage: 'en', // More languages in https://openweathermap.org/current#multi

  // Raindrop.io
  raindropApiKey: '',
  raindropCollection: '',

  // Oura
  ouraApiKey: '',
})