import { SettingsValue } from "../nanostores/settings";


export const SettingsFormFields: Partial<Record<keyof SettingsValue, {
  title: string;
  description?: string;
  values?: string[];
}>> = {
  name: {
    title: 'Name',
    description: 'Your name or nickname'
  },
  greetingMorning: {
    title: 'Morning Greeting',
    description: 'Greeting for the morning hours'
  },
  greetingAfternoon: {
    title: 'Afternoon Greeting',
    description: 'Greeting for the afternoon hours'
  },
  greetingEvening: {
    title: 'Evening Greeting',
    description: 'Greeting for the evening hours'
  },
  greetingNight: {
    title: 'Night Greeting',
    description: 'Greeting for the night hours'
  },
  weatherKey: {
    title: 'OpenWeatherMap API Key',
    description: 'Get your API key at https://home.openweathermap.org'
  },
  weatherUnit: {
    title: 'Weather Unit',
    description: 'Temperature unit',
    values: ['C', 'F']
  },
  weatherLanguage: {
    title: 'Weather Language',
    description: 'Language for weather data. More languages in https://openweathermap.org/current#multi'
  },
  weatherDefaultLatitude: {
    title: 'Default Latitude',
    description: 'Default location latitude'
  },
  weatherDefaultLongitude: {
    title: 'Default Longitude',
    description: 'Default location longitude'
  },
  raindropApiKey: {
    title: 'Raindrop.io API Key',
  },
  raindropCollection: {
    title: 'Raindrop.io Collection ID',
  },
  ouraApiKey: {
    title: 'Oura API Key',
  }
}