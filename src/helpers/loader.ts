const loadingClassname = 'loading'

export function removeLoader(selector) {
  const loader = document.querySelector(selector)

  if (loader) {
    removeLoaderClass(loader)
  }
}

function removeLoaderClass(el: Element) {
  if (el.classList.contains(loadingClassname)) {
    el.classList.remove(loadingClassname)
  }
  else {
    el?.parentElement && removeLoaderClass(el.parentElement)
  }
}
