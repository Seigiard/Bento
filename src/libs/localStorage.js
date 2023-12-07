class LocalStorageConnector {
  constructor(key) {
    this.key = key;
  }
  get(defaultValue) {
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
  set(data) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }
}

export { LocalStorageConnector };
