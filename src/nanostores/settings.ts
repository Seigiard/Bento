import type { SettingsValue } from '../models/settings'
import { persistentMap } from '@nanostores/persistent'
import { defaultSettings } from '../models/settings'

export const $settings = persistentMap<SettingsValue>(
  'settings:',
  defaultSettings,
)
