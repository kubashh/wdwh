import { useSyncExternalStore } from "react";

type Listener = () => void;

export type Signal<T> = {
  get(): T;
  set(value: T): void;
  subscribe(listener: Listener): () => void;
};

export function createSignal<T>(initial: T): Signal<T> {
  let value = initial;
  const listeners = new Set<Listener>();

  return {
    get() {
      return value;
    },

    set(newValue: T) {
      if (Object.is(value, newValue)) return;
      value = newValue;
      listeners.forEach((l) => l());
    },

    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export function useSignal<T>(signal: Signal<T>): T {
  return useSyncExternalStore(signal.subscribe, signal.get);
}
