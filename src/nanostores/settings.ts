import { persistentMap } from "@nanostores/persistent"
import { SettingsValue, defaultSettings } from "../models/settings"

export const $settings = persistentMap<SettingsValue>('settings:', defaultSettings)