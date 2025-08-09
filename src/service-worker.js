import { manifest, version } from '@parcel/service-worker';

// Cache names
const CACHE_NAME = `bento-cache-${version}`;
const RUNTIME_CACHE = 'bento-runtime';

// Offline fallbacks
const OFFLINE_PAGE = '/';
const OFFLINE_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=';

async function install() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(manifest);
}

async function activate() {
  const keys = await caches.keys();
  await Promise.all(
    keys.map((key) => {
      if (key !== CACHE_NAME && key !== RUNTIME_CACHE) {
        return caches.delete(key);
      }
    })
  );
}

// Cache-first strategy with silent background update
async function handleFetch(request) {
  const cache = await caches.open(CACHE_NAME);
  const runtimeCache = await caches.open(RUNTIME_CACHE);

  // Try to get from cache first
  const cachedResponse = await cache.match(request) || await runtimeCache.match(request);

  if (cachedResponse) {
    // Serve from cache immediately
    // Silently update in background
    updateInBackground(request, runtimeCache);
    return cachedResponse;
  }

  // If not in cache, fetch from network
  try {
    const response = await fetch(request);

    // Cache the response if it's successful
    if (response.status === 200) {
      const responseClone = response.clone();
      runtimeCache.put(request, responseClone);
    }

    return response;
  } catch (error) {
    // Network failed - try to serve offline fallbacks
    return handleOfflineRequest(request);
  }
}

// Silent background update
async function updateInBackground(request, cache) {
  try {
    const response = await fetch(request);

    if (response.status === 200) {
      // Always update cache silently
      await cache.put(request, response.clone());
    }
  } catch (error) {
    // Silently fail - user doesn't need to know
  }
}

// Handle offline requests with fallbacks
async function handleOfflineRequest(request) {
  const url = new URL(request.url);

  // For HTML requests, try to serve the main page from cache
  if (request.destination === 'document' || request.headers.get('accept')?.includes('text/html')) {
    const cache = await caches.open(CACHE_NAME);
    const cachedPage = await cache.match(OFFLINE_PAGE);
    if (cachedPage) {
      return cachedPage;
    }
  }

  // For image requests, return placeholder image
  if (request.destination === 'image') {
    return new Response(
      await fetch(OFFLINE_IMAGE).then(r => r.blob()),
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }

  // For API requests (like Raindrop), return empty but valid response
  if (url.pathname.includes('/api/') || url.hostname.includes('api.')) {
    return new Response(JSON.stringify({
      collections: [],
      items: [],
      offline: true
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // For other requests, throw error to let app handle it
  throw new Error('Offline and no cache available');
}

// Event listeners
addEventListener('install', (e) => {
  e.waitUntil(install());
  self.skipWaiting();
});

addEventListener('activate', (e) => {
  e.waitUntil(activate());
  self.clients.claim();
});

addEventListener('fetch', (e) => {
  // Only handle GET requests for same origin
  if (e.request.method === 'GET' && e.request.url.startsWith(self.location.origin)) {
    e.respondWith(handleFetch(e.request));
  }
});
