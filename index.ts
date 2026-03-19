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

export type ClassValue = ClassArray | string | number | null | boolean | undefined;
export type ClassArray = ClassValue[];

export function clsx(...inputs: ClassValue[]) {
  let str = ``;
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === `string`) {
      str && (str += ` `);
      str += input;
    } else if (Array.isArray(input)) {
      str && (str += ` `);
      str += clsx(str);
    }
  }

  return str;
}
