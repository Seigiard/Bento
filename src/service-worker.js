import { manifest, version } from "@parcel/service-worker";

// Cache names
const CACHE_NAME = `bento-cache-${version}`;
const API_CACHE_NAME = "bento-api-cache-v1";

// API host for cross-origin caching
const API_HOST = "api.raindrop.io";

// Offline fallbacks
const OFFLINE_PAGE = "/";

async function install() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(manifest);
}

async function activate() {
  // Delete old caches (keep API cache)
  const keys = await caches.keys();
  await Promise.all(
    keys.map((key) => {
      if (key !== CACHE_NAME && key !== API_CACHE_NAME) {
        return caches.delete(key);
      }
    }),
  );
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);

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
      // Network failed, return cached response
      return cachedResponse;
    });

  // Return cached response immediately if available
  // The fetch continues in background to update cache
  return cachedResponse || fetchPromise;
}

// Handle same-origin requests
async function handleFetch(request) {
  const response = await staleWhileRevalidate(request, CACHE_NAME);
  return response || handleOfflineRequest(request);
}

// Handle API requests (cross-origin) with throttling
const API_REVALIDATE_INTERVAL = 5 * 60 * 1000; // 5 minutes
const apiLastFetched = new Map();

async function handleApiFetch(request) {
  const cache = await caches.open(API_CACHE_NAME);
  const cachedResponse = await cache.match(request);

  const cacheKey = request.url;
  const lastFetched = apiLastFetched.get(cacheKey) || 0;
  const now = Date.now();

  // If we have cache and it's fresh enough, return without revalidating
  if (cachedResponse && now - lastFetched < API_REVALIDATE_INTERVAL) {
    return cachedResponse;
  }

  // Otherwise, do stale-while-revalidate
  const fetchPromise = fetch(request)
    .then(async (networkResponse) => {
      if (networkResponse && networkResponse.status === 200) {
        apiLastFetched.set(cacheKey, now);
        const responseClone = networkResponse.clone();
        await cache.put(request, responseClone);
      }
      return networkResponse;
    })
    .catch(() => cachedResponse);

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

  // Only handle GET requests
  if (e.request.method !== "GET") {
    return;
  }

  // Handle API requests (cross-origin)
  if (requestUrl.hostname === API_HOST) {
    e.respondWith(handleApiFetch(e.request));
    return;
  }

  // Handle same-origin requests
  if (requestUrl.origin === self.location.origin) {
    e.respondWith(handleFetch(e.request));
  }
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
