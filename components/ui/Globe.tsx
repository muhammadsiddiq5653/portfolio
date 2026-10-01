import createGlobe from "cobe"
import { useTheme } from "next-themes"
import { useEffect, useRef } from "react"
import { MARKETS } from "../../data/site"

const HUB = MARKETS.ae.coords

/** Dotted WebGL globe with a marker on every market and arcs out from the Gulf. Drag to spin. */
export default function Globe({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; phi: number } | null>(null)
  const { resolvedTheme } = useTheme()
  const dark = resolvedTheme === "dark"

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let size = wrap.offsetWidth
    // start facing the Gulf (cobe: phi = π - (lng - π/2))
    let phi = Math.PI - ((HUB[1] * Math.PI) / 180 - Math.PI / 2)
    let target = phi
    let theta = 0.28
    let visible = true
    let frame = 0

    const markers = Object.values(MARKETS).map((mk) => ({
      location: mk.coords,
      size: mk.id === "ae" ? 0.07 : 0.045,
    }))
    const arcs = Object.values(MARKETS)
      .filter((mk) => mk.id !== "ae")
      .map((mk) => ({ from: HUB, to: mk.coords }))

    let globe: ReturnType<typeof createGlobe>
    try {
      globe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width: size * dpr,
        height: size * dpr,
        phi,
        theta,
        dark: dark ? 1 : 0,
        diffuse: dark ? 1.4 : 1.2,
        mapSamples: 18000,
        mapBrightness: dark ? 4 : 8,
        mapBaseBrightness: dark ? 0.02 : 0,
        baseColor: dark ? [0.18, 0.18, 0.17] : [0.97, 0.96, 0.93],
        markerColor: [1, 0.33, 0.15],
        glowColor: dark ? [0.25, 0.2, 0.18] : [0.96, 0.93, 0.88],
        markers,
        arcs,
        arcColor: [1, 0.4, 0.2],
        arcWidth: 0.6,
        arcHeight: 0.28,
        markerElevation: 0.01,
        opacity: dark ? 0.9 : 0.95,
      })
    } catch {
      return
    }

    const render = () => {
      if (visible) {
        if (!drag.current && !reduce) target += 0.0028
        phi += (target - phi) * 0.08
        globe.update({ phi, theta })
      }
      frame = requestAnimationFrame(render)
    }
    frame = requestAnimationFrame(render)
    requestAnimationFrame(() => (canvas.style.opacity = "1"))

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(canvas)
    const ro = new ResizeObserver(() => {
      size = wrap.offsetWidth
      globe.update({ width: size * dpr, height: size * dpr })
    })
    ro.observe(wrap)

    const down = (e: PointerEvent) => {
      drag.current = { x: e.clientX, phi: target }
      canvas.setPointerCapture(e.pointerId)
    }
    const move = (e: PointerEvent) => {
      if (!drag.current) return
      target = drag.current.phi + (e.clientX - drag.current.x) / 180
    }
    const up = () => (drag.current = null)
    canvas.addEventListener("pointerdown", down)
    canvas.addEventListener("pointermove", move)
    canvas.addEventListener("pointerup", up)
    canvas.addEventListener("pointercancel", up)

    return () => {
      cancelAnimationFrame(frame)
      io.disconnect()
      ro.disconnect()
      canvas.removeEventListener("pointerdown", down)
      canvas.removeEventListener("pointermove", move)
      canvas.removeEventListener("pointerup", up)
      canvas.removeEventListener("pointercancel", up)
      globe.destroy()
    }
  }, [dark])

  return (
    <div ref={wrapRef} className={`relative aspect-square ${className}`}>
      <canvas
        ref={canvasRef}
        data-cursor="Drag"
        className="h-full w-full touch-pan-y opacity-0 transition-opacity duration-[1500ms]"
        style={{ contain: "layout paint size" }}
      />
    </div>
  )
}
