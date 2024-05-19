export function getElement(selector: string) {
  const document = globalThis?.document;

  if (!document) {
    return
  }

  const el = document.querySelector(selector);

  if (!el) {
    return;
  }

  return el;
}
