import { persistentAtom } from '@nanostores/persistent';

export function lsAtom<T>(key: string, defaultValue: T) {
  return persistentAtom<T>(key, defaultValue, {
    encode: JSON.stringify,
    decode: JSON.parse,
  });
}
