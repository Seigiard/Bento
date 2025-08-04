export type SettingsValue = {
  theme: 'dark' | 'light' | 'system';
  name: string;
  greetingMorning: string;
  greetingAfternoon: string;
  greetingEvening: string;
  greetingNight: string;
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
  raindropApiKey: {
    title: 'Raindrop.io API Key',
    description: 'Get your API key from Raindrop.io settings. All collections will be loaded automatically.',
  },
};
