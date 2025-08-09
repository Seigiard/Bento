import { manifest, version } from '@parcel/service-worker';

// Cache names
const CACHE_NAME = `bento-cache-${version}`;
const RUNTIME_CACHE = 'bento-runtime';

// Offline fallbacks
const OFFLINE_PAGE = '/';
const OFFLINE_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=';

// Network timeout in milliseconds
const NETWORK_TIMEOUT = 3000;

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

// Network-first strategy with timeout fallback to cache
async function handleFetch(request) {
  const cache = await caches.open(CACHE_NAME);
  const runtimeCache = await caches.open(RUNTIME_CACHE);

  // For HTML pages, always try network first
  if (request.mode === 'navigate' || request.destination === 'document' || 
      request.headers.get('accept')?.includes('text/html')) {
    return networkFirstStrategy(request, cache, runtimeCache);
  }

  // For static assets (JS, CSS), use cache-first with background update
  if (request.destination === 'script' || request.destination === 'style' || 
      request.destination === 'font' || request.destination === 'image') {
    return cacheFirstStrategy(request, cache, runtimeCache);
  }

  // For API requests, always use network-first
  return networkFirstStrategy(request, cache, runtimeCache);
}

// Network-first strategy: Try network, fallback to cache
async function networkFirstStrategy(request, cache, runtimeCache) {
  try {
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Network timeout')), NETWORK_TIMEOUT);
    });

    // Race between network fetch and timeout
    const networkResponse = await Promise.race([
      fetch(request),
      timeoutPromise
    ]);

    // Cache successful responses
    if (networkResponse.status === 200) {
      const responseClone = networkResponse.clone();
      
      // Determine which cache to use
      if (manifest.includes(request.url)) {
        cache.put(request, responseClone);
      } else {
        runtimeCache.put(request, responseClone);
      }
    }

    return networkResponse;
  } catch (error) {
    // Network failed or timed out - try cache
    const cachedResponse = await cache.match(request) || await runtimeCache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }

    // No cache available - handle offline
    return handleOfflineRequest(request);
  }
}

// Cache-first strategy: Try cache, fallback to network
async function cacheFirstStrategy(request, cache, runtimeCache) {
  // Check cache first
  const cachedResponse = await cache.match(request) || await runtimeCache.match(request);
  
  if (cachedResponse) {
    // Update cache in background for next time
    updateInBackground(request, runtimeCache);
    return cachedResponse;
  }

  // Not in cache, fetch from network
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.status === 200) {
      const responseClone = networkResponse.clone();
      runtimeCache.put(request, responseClone);
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed - handle offline
    return handleOfflineRequest(request);
  }
}

// Silent background update
async function updateInBackground(request, cache) {
  try {
    const response = await fetch(request);
    
    if (response.status === 200) {
      await cache.put(request, response.clone());
    }
  } catch (error) {
    // Silently fail - user is already seeing cached content
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

  // For local API requests, return empty but valid response
  if (url.pathname.includes('/api/')) {
    return new Response(JSON.stringify({
      error: 'Offline',
      offline: true
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // For other requests, return generic offline response
  return new Response('Offline', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: { 'Content-Type': 'text/plain' }
  });
}

// Event listeners
addEventListener('install', (e) => {
  e.waitUntil(install());
  // Skip waiting to activate immediately
  self.skipWaiting();
});

addEventListener('activate', (e) => {
  e.waitUntil(activate());
  // Take control of all clients immediately
  self.clients.claim();
});

addEventListener('fetch', (e) => {
  // Only handle GET requests
  if (e.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(e.request.url);
  
  // Don't cache Raindrop API requests - let them go directly to network
  if (requestUrl.hostname === 'api.raindrop.io') {
    return;
  }
  
  // Only handle same-origin requests
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  e.respondWith(handleFetch(e.request));
});

// Listen for messages from the client
addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      })
    );
  }
});