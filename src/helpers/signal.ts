export function updateSignal<T extends Record<string, any>>(
  signal,
  data: T,
  defaultData: T
) {
  Object.keys(data).forEach((key) => {
    signal[key] = data[key] || defaultData[key];
  });
}
