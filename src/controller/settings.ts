import { getElement } from "../helpers/getElement";
import { SettingsValue } from "../models/settings";
import { $settings } from "../nanostores/settings";

const dialog = getElement<HTMLDialogElement>('#settings');

getElement('#settingsButton')?.addEventListener('click', () => {
  dialog?.show();
});

getElement('#settingsForm')?.addEventListener('change', (event) => {
  const target = event.target as HTMLInputElement;
  const key = target.name;
  const value = target.value;

  $settings.setKey(key as keyof SettingsValue, value);
})