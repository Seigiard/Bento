import { useRef } from 'preact/hooks'
import { useStore } from '@nanostores/preact'
import { $settings } from '../nanostores/settings'
import { SettingsFormFields, themeList } from '../models/settings'
import { TbSettings } from "react-icons/tb";

export function Settings() {
  const modalRef = useRef<HTMLDialogElement>(null)
  const settings = useStore($settings)

  const openModal = () => {
    modalRef.current?.showModal()
  }

  const closeModal = () => {
    modalRef.current?.close()
  }

  const handleRaindropApiKeyChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    $settings.setKey('raindropApiKey', target.value)
  }

  const handleThemeChange = (event: Event) => {
    const target = event.target as HTMLSelectElement
    $settings.setKey('theme', target.value as 'light' | 'dark' | 'system')
  }

  return (
    <>
      <button
        class="btn btn-circle"
        onClick={openModal}
        aria-label="Open settings"
      >
        <TbSettings />
      </button>

      <dialog ref={modalRef} class="modal">
        <div class="modal-box w-2xl max-w-10/12">
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 class="font-bold text-lg mb-4">Settings</h3>

          <fieldset class="fieldset bg-base-200 border-base-300 rounded-box border p-4 mb-4">
            <legend class="fieldset-legend">Appearance</legend>
            <label class="label" for="theme-select">{SettingsFormFields.theme?.title}</label>
            <select
              id="theme-select"
              class="select select-bordered w-full max-w-xs"
              value={settings.theme}
              onChange={handleThemeChange}
            >
              {themeList.map(theme => (
                <option key={theme} value={theme}>
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </option>
              ))}
            </select>
          </fieldset>

          <fieldset class="fieldset bg-base-200 border-base-300 rounded-box border p-4">
            <legend class="fieldset-legend">Integrations</legend>
            <label class="label" for="raindrop-api-key">{SettingsFormFields.raindropApiKey?.title}</label>
            <input
              id="raindrop-api-key"
              type="password"
              placeholder="Enter your Raindrop.io API key"
              class="input input-bordered w-full"
              value={settings.raindropApiKey}
              onInput={handleRaindropApiKeyChange}
            />
            <p class="label">{SettingsFormFields.raindropApiKey?.description}</p>
          </fieldset>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}
