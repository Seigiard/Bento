import type { SettingsValue } from '../models/settings'
import { persistentMap } from '@nanostores/persistent'
import { defaultSettings } from '../models/settings'
import { computed } from 'nanostores';

export const $settings = persistentMap<SettingsValue>(
  'settings:',
  defaultSettings,
)

export const $raindropApiKey = computed($settings, (settings) => settings.raindropApiKey);
