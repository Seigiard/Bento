export type SettingsValue = {
  theme: 'dark' | 'light' | 'system';
  raindropApiKey: string;
};

export const themeList: SettingsValue['theme'][] = ['light', 'dark', 'system'];

export const defaultSettings: SettingsValue = {
  theme: 'system',



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
  raindropApiKey: {
    title: 'Raindrop.io API Key',
    description: 'Get your API key from Raindrop.io settings. All collections will be loaded automatically.',
  },
};
