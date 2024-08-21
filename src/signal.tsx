
let signal;

export function setGlobalSignal(signalImpl) {
  signal = signalImpl;
}

export function dispatchEvent<T>(type: string, detail: T) {
  signal.dispatchEvent(new CustomEvent(type, {
    detail
  }))
}