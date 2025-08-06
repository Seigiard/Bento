import { useRef } from 'preact/hooks'

export function Settings() {
  const modalRef = useRef<HTMLDialogElement>(null)

  const openModal = () => {
    modalRef.current?.showModal()
  }

  const closeModal = () => {
    modalRef.current?.close()
  }

  return (
    <>
      <button
        class="btn"
        onClick={openModal}
        aria-label="Open settings"
      >
        OPNE
      </button>

      <dialog ref={modalRef} class="modal">
        <div class="modal-box">
          <h3 class="font-bold text-lg mb-4">Settings</h3>
          <p class="py-4">Here you can configure your Bento settings.</p>

          <div class="modal-action">
            <button
              class="btn"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}
