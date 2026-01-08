import { useStore } from "@nanostores/preact";
import { $editMode } from "../nanostores/editmode";

export function EditMode() {
  const editMode = useStore($editMode);

  function handleEditModeToggle() {
    $editMode.set(!editMode);
  }

  return (
    <div className="tooltip tooltip-left" data-tip="Edit mode (work in progress)">
      <button
        class="btn btn-ghost btn-circle"
        onClick={handleEditModeToggle}
        disabled
        aria-label="Open settings"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <use href="#editIcon" />
        </svg>
      </button>
    </div>
  );
}
