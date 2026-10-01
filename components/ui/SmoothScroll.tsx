import Lenis from "lenis"
import { createContext, useContext, useEffect, useState } from "react"

const LenisContext = createContext<Lenis | null>(null)

export const useLenis = () => useContext(LenisContext)

/** Scroll to an element or y-offset, smoothly when Lenis is running. */
export function scrollToTarget(lenis: Lenis | null, target: string | number) {
  if (lenis) {
    lenis.scrollTo(target, { offset: 0, duration: 1.4 })
    return
  }
  if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" })
  else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" })
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const instance = new Lenis({ lerp: 0.1, smoothWheel: true })
    let frame = 0
    const raf = (time: number) => {
      instance.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)
    setLenis(instance)
    return () => {
      cancelAnimationFrame(frame)
      instance.destroy()
      setLenis(null)
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
