import { persistentAtom } from "@nanostores/persistent";

export const $pinnedCategories = persistentAtom<string[]>("pinnedCategories", [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export function togglePin(categoryId: string) {
  const current = $pinnedCategories.get();
  const index = current.indexOf(categoryId);

  if (index === -1) {
    $pinnedCategories.set([...current, categoryId]);
  } else {
    $pinnedCategories.set(current.filter((id) => id !== categoryId));
  }
}

export function isPinned(categoryId: string): boolean {
  return $pinnedCategories.get().includes(categoryId);
}
