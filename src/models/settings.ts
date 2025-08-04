export type SettingsValue = {
  theme: 'dark' | 'light' | 'system';
  name: string;
  greetingMorning: string;
  greetingAfternoon: string;
  greetingEvening: string;
  greetingNight: string;
  weatherKey: string;
  weatherUnit: 'F' | 'C';
  weatherDefaultLatitude: string;
  weatherDefaultLongitude: string;
  weatherLanguage: string;
  raindropApiKey: string;
};

export const themeList: SettingsValue['theme'][] = ['light', 'dark', 'system'];

export const defaultSettings: SettingsValue = {
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
};

export const SettingsFormFields: Partial<
  Record<
    keyof SettingsValue,
    {
      title: string;
      description?: string;
      values?: string[];
    }
  >
> = {
  theme: {
    title: 'Theme',
    values: themeList,
  },
  name: {
    title: 'Name',
    description: 'Your name or nickname',
  },
  greetingMorning: {
    title: 'Morning Greeting',
    description: 'Greeting for the morning hours',
  },
  greetingAfternoon: {
    title: 'Afternoon Greeting',
    description: 'Greeting for the afternoon hours',
  },
  greetingEvening: {
    title: 'Evening Greeting',
    description: 'Greeting for the evening hours',
  },
  greetingNight: {
    title: 'Night Greeting',
    description: 'Greeting for the night hours',
  },
  weatherKey: {
    title: 'OpenWeatherMap API Key',
    description: 'Get your API key at https://home.openweathermap.org',
  },
  weatherUnit: {
    title: 'Weather Unit',
    description: 'Temperature unit',
    values: ['C', 'F'],
  },
  weatherLanguage: {
    title: 'Weather Language',
    description:
      'Language for weather data. More languages in https://openweathermap.org/current#multi',
  },
  weatherDefaultLatitude: {
    title: 'Default Latitude',
    description: 'Default location latitude',
  },
  weatherDefaultLongitude: {
    title: 'Default Longitude',
    description: 'Default location longitude',
  },
  raindropApiKey: {
    title: 'Raindrop.io API Key',
    description: 'Get your API key from Raindrop.io settings. All collections will be loaded automatically.',
  },
};
