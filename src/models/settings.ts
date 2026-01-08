export interface SettingsValue extends Record<string, string | undefined> {
  theme: "dark" | "light" | "system";
  raindropApiKey: string;
}

export const themeList: SettingsValue["theme"][] = ["light", "dark", "system"];

export const defaultSettings: SettingsValue = {
  theme: "system",
  raindropApiKey: "",
};
