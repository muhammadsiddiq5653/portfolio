import { m, useMotionValue, useSpring } from "framer-motion"
import { useEffect, useState } from "react"

/**
 * Dot + trailing ring. Any element with `data-cursor="Label"` grows the ring
 * and shows the label; `data-cursor=""` just grows it.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const [label, setLabel] = useState<string | null>(null)
  const [down, setDown] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 260, damping: 26, mass: 0.6 })
  const ry = useSpring(y, { stiffness: 260, damping: 26, mass: 0.6 })

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    if (!fine) return
    setEnabled(true)
    document.documentElement.classList.add("has-cursor")

    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const el = (e.target as HTMLElement | null)?.closest?.("[data-cursor], a, button, input, textarea")
      if (!el) return setLabel(null)
      const attr = el.getAttribute("data-cursor")
      setLabel(attr ?? "")
    }
    const leave = () => {
      x.set(-100)
      y.set(-100)
    }
    const pd = () => setDown(true)
    const pu = () => setDown(false)
    window.addEventListener("pointermove", move)
    document.addEventListener("pointerleave", leave)
    window.addEventListener("pointerdown", pd)
    window.addEventListener("pointerup", pu)
    return () => {
      document.documentElement.classList.remove("has-cursor")
      window.removeEventListener("pointermove", move)
      document.removeEventListener("pointerleave", leave)
      window.removeEventListener("pointerdown", pd)
      window.removeEventListener("pointerup", pu)
    }
  }, [x, y])

  if (!enabled) return null
  const active = label !== null
  const hasText = !!label

  return (
    <>
      <m.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[100]" style={{ x, y }}>
        <div className="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
      </m.div>
      <m.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[99] mix-blend-difference" style={{ x: rx, y: ry }}>
        <m.div
          className="flex items-center justify-center rounded-full border-solid font-mono text-[10px] uppercase tracking-[0.16em]"
          style={{ x: "-50%", y: "-50%" }}
          animate={{
            width: hasText ? 92 : active ? 56 : 32,
            height: hasText ? 92 : active ? 56 : 32,
            backgroundColor: hasText ? "rgba(255,255,255,1)" : "rgba(255,255,255,0)",
            borderColor: "rgba(255,255,255,0.9)",
            borderWidth: hasText ? 0 : 1,
            scale: down ? 0.85 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
        >
          {hasText && <span className="text-black">{label}</span>}
        </m.div>
      </m.div>
    </>
  )
}
