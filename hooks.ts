import { useState } from "react";

export function useRefresh() {
  const f = useState(false)[1];
  return () => f((prev) => !prev);
}

export function useConst<T>(value: T) {
  return useState(value)[0];
}

export function useHover() {
  const [isHover, setIsHover] = useState(false);
  return [
    isHover,
    {
      onMouseEnter: () => setIsHover(true),
      onMouseLeave: () => setIsHover(false),
    },
  ];
}

export function useSearchParam(key: string, defaultValue: string) {
  const arr = useState(getSearchParam(key, defaultValue));

  setSearchParam(key, arr[0]);

  return arr;
}

function getSearchParam(key: string, defaultValue: string) {
  const params = new URLSearchParams(location.search);
  return params.has(key) ? decodeURI(params.get(key)!) : defaultValue;
}

function setSearchParam(key: string, newValue: string) {
  const params = new URLSearchParams(location.search);
  params.set(key, newValue as string);
  history.pushState(null, ``, `?${params.toString()}`);
}
