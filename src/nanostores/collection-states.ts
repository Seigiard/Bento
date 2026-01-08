import { persistentAtom } from "@nanostores/persistent";

export const $expandedCollections = persistentAtom<string[]>("openCategories", [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export function toggleCategory(categoryId: string) {
  const current = $expandedCollections.get();
  const index = current.indexOf(categoryId);

  if (index === -1) {
    $expandedCollections.set([...current, categoryId]);
  } else {
    $expandedCollections.set(current.filter((id) => id !== categoryId));
  }
}

export function isCategoryOpen(categoryId: string): boolean {
  return $expandedCollections.get().includes(categoryId);
}
