import { persistentAtom } from '@nanostores/persistent'

export const $openCategories = persistentAtom<string[]>(
  'openCategories',
  [],
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
)

export function toggleCategory(categoryId: string) {
  const current = $openCategories.get()
  const index = current.indexOf(categoryId)
  
  if (index === -1) {
    $openCategories.set([...current, categoryId])
  } else {
    $openCategories.set(current.filter(id => id !== categoryId))
  }
}

export function isCategoryOpen(categoryId: string): boolean {
  return $openCategories.get().includes(categoryId)
}