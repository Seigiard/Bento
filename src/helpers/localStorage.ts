export type JSONable =
  | string
  | number
  | boolean
  | null
  | undefined
  | JSONable[]
  | { [key: string]: JSONable }
  | { toJSON(): JSONable };

class LocalStorageConnector {
  key: string;
  constructor(key) {
    this.key = key;
  }
  get(defaultValue: JSONable) {
    const data = localStorage.getItem(this.key);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        return defaultValue;
      }
    }
    return defaultValue;
  }
  set(data: JSONable) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }
}

export { LocalStorageConnector };
