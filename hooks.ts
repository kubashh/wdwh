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

// export function useUrl<T>(key: string, defaultValue: T) {
//   const [state, setState] = useState<T>();

//   return [state];
// }

// function getFromUrl(key: string) {
//   const url = window.
// }
