import { useRef } from 'preact/hooks'
import { useStore } from '@nanostores/preact'
import { $settings } from '../nanostores/settings'
import { revalidateKeys } from '../nanoquery/generic-fetcher'

export function Settings() {
  const modalRef = useRef<HTMLDialogElement>(null)
  const { raindropApiKey } = useStore($settings)

  const openModal = () => {
    modalRef.current?.showModal()
  }

  const handleRaindropApiKeyChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    $settings.setKey('raindropApiKey', target.value)
  }

  return (
    <>
      <div className="tooltip tooltip-left" data-tip="Settings">
        <button
          class="btn btn-ghost btn-circle"
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
            <use href="#settingsIcon" />
          </svg>
        </button>
      </div>

      <dialog ref={modalRef} class="modal">
        <div class="modal-box w-2xl max-w-10/12">
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <use href="#closeIcon" />
              </svg>
            </button>
          </form>
          <div className='grid grid-cols-1 gap-4'>
            <h3 class="font-bold text-lg">Settings</h3>
            <fieldset class="fieldset">
              <label class="label font-bold" for="raindrop-api-key">
                Raindrop.io API Key
              </label>
              <input
                id="raindrop-api-key"
                type="text"
                placeholder="Enter your Raindrop.io API key"
                class="input input-bordered w-full"
                value={raindropApiKey}
                onInput={handleRaindropApiKeyChange}
              />
              <p class="label">
                Get your API key from Raindrop.io settings. All collections will be loaded automatically.
              </p>
            </fieldset>

            <fieldset class="fieldset">
              <label class="label font-bold" for="raindrop-api-key">Refresh all data</label>
              <button class="btn justify-self-start" onClick={() => { revalidateKeys(() => true) }}>
                Refresh
              </button>
            </fieldset>

          </div>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}
