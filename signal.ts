import { useSyncExternalStore } from "react";

type Listener = () => void;

export type Signal<T> = {
  get(): T;
  set(newValueOrFn: T | ((prev: T) => T)): void;
  subscribe(listener: Listener): () => void;
  use(): T;
};

export function createSignal<T>(initial: T): Signal<T> {
  let value = initial;
  const listeners = new Set<Listener>();

  function get() {
    return value;
  }

  function subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return {
    get,

    set(newValueOrFn) {
      const newValue =
        typeof newValueOrFn === "function" ? (newValueOrFn as (prev: T) => T)(value) : newValueOrFn;

      if (Object.is(value, newValue)) return;

      value = newValue;
      listeners.forEach((l) => l());
    },

    subscribe,

    use() {
      return useSyncExternalStore(subscribe, get);
    },
  };
}

export function useSignal<T>(signal: Signal<T>): T {
  return useSyncExternalStore(signal.subscribe, signal.get);
}
