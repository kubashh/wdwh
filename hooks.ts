import { useState } from "react"

export function useRefresh() {
  const f = useState(false)[1]
  return () => f((prev) => !prev)
}

export function useConst<T>(value: T) {
  return useState(value)[0]
}

export function useHover() {
  const [isHover, setIsHover] = useState(false)
  return [
    isHover,
    {
      onMouseEnter: () => setIsHover(true),
      onMouseLeave: () => setIsHover(false),
    },
  ]
}
