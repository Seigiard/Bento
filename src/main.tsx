import { render } from "preact";
import { App } from "./App";

// Simple service worker registration - only in production
if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
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
