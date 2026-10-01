import { useEffect, useState } from "react"

/** Current time, re-rendered every `interval` ms. Null until mounted to avoid hydration mismatch. */
export function useNow(interval = 1000) {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), interval)
    return () => clearInterval(id)
  }, [interval])
  return now
}
