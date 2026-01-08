import { atom } from "nanostores";

export const $isOffline = atom(!navigator.onLine);

// Update store when online status changes
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    $isOffline.set(false);
  });

  window.addEventListener("offline", () => {
    $isOffline.set(true);
  });
}
