# Code Improvements Plan

Date: 2026-01-14

## Overview

Fix bugs, improve store architecture, and clean up dead code based on architecture and code review analysis.

---

## Section 1: Bug Fixes

### 1.1 EditMode.tsx — Remove onClick, keep only link

The component currently has both `href` and `onClick`, which conflicts. Keep only the link to Raindrop.io.

**Changes:**
- Remove `useStore($editMode)` usage
- Remove `handleEditModeToggle` function
- Remove `onClick` handler
- Keep only `<a href="https://app.raindrop.io/">`

### 1.2 App.tsx — Replace className with class

Lines 20-21, 25, 34 use `className` instead of `class`. Fix to match project standard (Preact uses `class`).

### 1.3 raindrop-schemas.ts:103 — Fix error message

Change `Invalid raindrop format:` to `Invalid user format:` (copy-paste error).

---

## Section 2: Store Architecture

### 2.1 CategoryLinks.tsx — Use store registry

**Problem:** Component creates store via `useState`, bypassing global registry. This causes duplicate stores and duplicate API requests.

**Solution:**
```typescript
// Before:
const [$raindropStore] = useState(() => createRaindropsStore(collectionId));

// After:
const $raindropStore = getRaindropsStore(collectionId);
```

### 2.2 Clear registry on API key change

Add function to clear stores in `raindrops-fetcher.ts`:
```typescript
export function clearRaindropsStores() {
  raindropsStores.clear();
}
```

Subscribe to API key changes in `settings.ts`:
```typescript
$raindropApiKey.subscribe(() => {
  clearRaindropsStores();
});
```

### 2.3 Document intentional subscription pattern

In `raindrops-fetcher.ts:69`, add comment explaining why cleanup is not needed:
```typescript
// Intentionally no cleanup — stores are long-lived singletons
store.subscribe(() => {});
```

---

## Section 3: Dead Code Cleanup

### 3.1 Remove isPinned() from collection-states.ts

Function is exported but never used. Components check pinned state directly via `useStore($pinnedCategories).includes(id)`.

### 3.2 Remove unused code from EditMode.tsx

After bug fix in Section 1, remove:
- `useStore` import (if unused)
- `$editMode`, `toggleEditMode` imports
- `editMode` variable
- `handleEditModeToggle` function

### 3.3 Translate Russian comments to English

Files with Russian comments:
- `src/schemas/raindrop-schemas.ts` (~10 comments)
- `src/nanoquery/raindrop-collections-fetcher.ts` (~15 comments)
- `src/components/NestedCollections.tsx` (1 comment)

Translate meaningful comments, remove obvious ones.

---

## Implementation Order

1. Section 1 (Bug Fixes) — quick wins, high impact
2. Section 2 (Store Architecture) — critical fix
3. Section 3 (Dead Code) — cleanup

## Notes

- Prefetch system remains — needed for future search feature
- Service Worker caching unchanged
- All changes are backwards compatible
