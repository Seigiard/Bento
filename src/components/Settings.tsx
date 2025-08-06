import { useRef } from 'preact/hooks'
import { useStore } from '@nanostores/preact'
import { $settings } from '../nanostores/settings'
import { SettingsFormFields, themeList } from '../models/settings'

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
        class="btn btn-circle absolute bottom-4 right-4"
        onClick={openModal}
        aria-label="Open settings"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
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
