import { manifest, version } from "@parcel/service-worker";

// Cache names
const CACHE_NAME = `bento-cache-${version}`;

// Offline fallbacks
const OFFLINE_PAGE = "/";

async function install() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(manifest);
}

async function activate() {
  // Delete old caches
  const keys = await caches.keys();
  await Promise.all(
    keys.map((key) => {
      if (key !== CACHE_NAME) {
        return caches.delete(key);
      }
    }),
  );
}

// Stale-while-revalidate strategy for same-origin requests
async function handleFetch(request) {
  const cache = await caches.open(CACHE_NAME);

  // Try to get from cache first
  const cachedResponse = await cache.match(request);

  // Start background update
  const fetchPromise = fetch(request)
    .then(async (networkResponse) => {
      // Only cache successful responses
      if (networkResponse && networkResponse.status === 200) {
        const responseClone = networkResponse.clone();
        await cache.put(request, responseClone);
      }
      return networkResponse;
    })
    .catch(() => {
      // Network failed, return cached or offline response
      return cachedResponse || handleOfflineRequest(request);
    });

  // Return cached response immediately if available
  // The fetch continues in background to update cache
  return cachedResponse || fetchPromise;
}

// Handle offline requests with fallbacks
async function handleOfflineRequest(request) {
  // For HTML requests, try to serve the main page from cache
  if (request.destination === "document" || request.headers.get("accept")?.includes("text/html")) {
    const cache = await caches.open(CACHE_NAME);
    const cachedPage = await cache.match(OFFLINE_PAGE);
    if (cachedPage) {
      return cachedPage;
    }
  }

  // For other requests, return generic offline response
  return new Response("Offline", {
    status: 503,
    statusText: "Service Unavailable",
    headers: { "Content-Type": "text/plain" },
  });
}

// Event listeners
addEventListener("install", (e) => {
  e.waitUntil(install());
  // Skip waiting to activate immediately
  self.skipWaiting();
});

addEventListener("activate", (e) => {
  e.waitUntil(activate());
  // Take control of all clients immediately
  self.clients.claim();
});

addEventListener("fetch", (e) => {
  const requestUrl = new URL(e.request.url);

  // Only handle same-origin GET requests
  if (e.request.method !== "GET" || requestUrl.origin !== self.location.origin) {
    return;
  }

  e.respondWith(handleFetch(e.request));
});

// Listen for messages from the client
addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "CLEAR_CACHE") {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
      }),
    );
  }
});
