import { persistentMap } from "@nanostores/persistent";
import { computed } from "nanostores";

import type { SettingsValue } from "../models/settings";
import { defaultSettings } from "../models/settings";

export const $settings = persistentMap<SettingsValue>("settings:", defaultSettings);

$settings.subscribe((settings) => {
  // update Tailwind/DaisyUI theme settings
  document.documentElement.dataset.theme = settings.theme === "system" ? undefined : settings.theme;
});

export const $raindropApiKey = computed($settings, (settings) => settings.raindropApiKey);
