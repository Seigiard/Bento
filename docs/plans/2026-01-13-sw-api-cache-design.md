# Service Worker API Caching

## Problem

При загрузке страницы пользователь видит лоадеры ~0.5 сек из-за:
1. Ожидания загрузки IndexedDB (`$cacheReady`)
2. Race condition между IndexedDB и nanoquery
3. Истечения `dedupeTime` после простоя

## Solution

Убрать IndexedDB кеширование. Кешировать API запросы через Service Worker с политикой stale-while-revalidate.

## Architecture

**Before (3 layers):**
```
App → nanoquery → IndexedDB → fetch → SW → Network
```

**After (1 layer):**
```
App → nanoquery → fetch → SW (stale-while-revalidate) → Network
```

## Changes

### 1. Service Worker (`service-worker.js`)

Добавить кеширование для `api.raindrop.io`:

```js
const API_CACHE = 'bento-api-cache-v1';
const API_HOST = 'api.raindrop.io';

// В fetch handler добавить:
if (url.hostname === API_HOST) {
  return staleWhileRevalidate(event, API_CACHE);
}
```

### 2. Delete files

- `src/nanoquery/cache.ts` — больше не нужен

### 3. Simplify nanoquery (`generic-fetcher.ts`)

```ts
// Before
import { cache } from "./cache";
const [createGenericFetcherStore, , { revalidateKeys }] = nanoquery({ cache });

// After
const [createGenericFetcherStore, , { revalidateKeys }] = nanoquery();
```

### 4. Simplify App.tsx

Убрать `$cacheReady`:

```tsx
// Before
if (!cacheReady) {
  return <CategoryCardSkeleton />;
}

// After
// (удалить этот блок)
```

### 5. Update fetchers

Убрать `revalidateInterval: 1000` — SW сам обновляет в фоне:

```ts
// Before
{
  dedupeTime: 1000 * 60 * 60,
  revalidateInterval: 1000,
}

// After
{
  dedupeTime: 1000 * 60 * 5, // 5 min — только дедупликация
}
```

## Files to modify

| File | Action |
|------|--------|
| `src/service-worker.js` | Add API caching |
| `src/nanoquery/cache.ts` | Delete |
| `src/nanoquery/generic-fetcher.ts` | Simplify |
| `src/App.tsx` | Remove $cacheReady |
| `src/nanoquery/raindrop-collections-fetcher.ts` | Remove revalidateInterval |
| `src/nanoquery/raindrops-fetcher.ts` | Remove revalidateInterval if present |

## Verification

1. Открыть страницу → данные мгновенно из SW кеша
2. Обновить страницу → мгновенно, без лоадера
3. Подождать час → мгновенно из кеша, обновление в фоне
4. Offline → данные из кеша работают
5. DevTools → Network показывает "(from service worker)"
