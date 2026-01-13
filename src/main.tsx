import { render } from "preact";

import { App } from "./App";

// Service worker registration for caching
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register(new URL("./service-worker.js", import.meta.url), { type: "module" })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}

const root = document.getElementById("app");
if (root) {
  render(<App />, root);
}
