export function updateSignal<T extends Record<string, any>>(
  signal,
  data: T,
  defaultData: T
) {
  Object.keys(data).forEach((key) => {
    signal[key] = data[key] || defaultData[key];
  });
}

export function onSignalRerender(
  signalName: string,
  cb: (event: Event) => void
) {
  // Listen for data changes
  document.addEventListener(`reef:signal-${signalName}`, function (event) {
    cb(event);
  });
}
