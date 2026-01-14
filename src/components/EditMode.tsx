export function EditMode() {
  return (
    <a
      href="https://app.raindrop.io/"
      class="btn btn-ghost font-normal btn-circle focus-visible:outline-accent tooltip tooltip-bottom"
      data-tip="Open Raindrop.io"
      aria-label="Open Raindrop.io"
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
    </a>
  );
}
