import { AnimatePresence, m } from "framer-motion"
import { useCallback, useEffect, useRef, useState } from "react"
import { TOUR, TourStep } from "../../data/site"
import { EASE } from "./Motion"
import { useLenis } from "./SmoothScroll"

const SCROLL_MS = 1600
const pad = (n: number) => String(n).padStart(2, "0")

/** Time on a step: the flight there, then enough to read the caption comfortably. */
const durationOf = (s: TourStep) => SCROLL_MS + Math.max(3800, s.caption.split(" ").length * 270)

function targetY({ sel, progress, offset = 0 }: TourStep["target"]) {
  const el = document.querySelector<HTMLElement>(sel)
  if (!el) return null
  const top = el.getBoundingClientRect().top + window.scrollY
  if (progress != null) return top + (el.offsetHeight - window.innerHeight) * progress
  return Math.max(0, top + offset)
}

/**
 * Captioned, self-driving tour of the page. Start it from anywhere with
 * `window.dispatchEvent(new Event("tour:start"))`.
 */
export default function Tour() {
  const lenis = useLenis()
  const [active, setActive] = useState(false)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const timer = useRef<ReturnType<typeof setTimeout>>()
  const remaining = useRef(0)
  const startedAt = useRef(0)
  const flying = useRef(false)
  const strayed = useRef(false)

  const step = TOUR[index]
  const dur = durationOf(step)

  const close = useCallback(() => {
    clearTimeout(timer.current)
    setActive(false)
  }, [])

  const go = useCallback(
    (i: number) => {
      if (i >= TOUR.length) return close()
      setIndex(Math.max(0, i))
      setPlaying(true)
    },
    [close]
  )

  // start
  useEffect(() => {
    const start = () => {
      setIndex(0)
      setPlaying(true)
      setActive(true)
    }
    window.addEventListener("tour:start", start)
    return () => window.removeEventListener("tour:start", start)
  }, [])

  const fly = useCallback(
    (i: number) => {
      const y = targetY(TOUR[i].target)
      if (y == null) return
      flying.current = true
      strayed.current = false
      const done = () => (flying.current = false)
      if (lenis) lenis.scrollTo(y, { duration: SCROLL_MS / 1000, lock: true, force: true, onComplete: done })
      else {
        window.scrollTo({ top: y, behavior: "smooth" })
        setTimeout(done, SCROLL_MS)
      }
    },
    [lenis]
  )

  // fly to each step as it begins
  useEffect(() => {
    if (!active) return
    remaining.current = durationOf(TOUR[index])
    fly(index)
  }, [active, index, fly])

  // resuming after the visitor scrolled away: fly back to where we were
  useEffect(() => {
    if (active && playing && strayed.current) fly(index)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing])

  // advance when the step's time runs out; pausing keeps the time left
  useEffect(() => {
    if (!active || !playing) return
    startedAt.current = performance.now()
    timer.current = setTimeout(() => go(index + 1), remaining.current)
    return () => {
      clearTimeout(timer.current)
      remaining.current -= performance.now() - startedAt.current
    }
  }, [active, playing, index, go])

  // keyboard, and pause when the visitor takes over the scroll
  useEffect(() => {
    if (!active) return
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      else if (e.key === " ") {
        e.preventDefault()
        setPlaying((p) => !p)
      } else if (e.key === "ArrowRight") go(index + 1)
      else if (e.key === "ArrowLeft") go(index - 1)
    }
    const takeover = () => {
      if (flying.current) return
      strayed.current = true
      setPlaying(false)
    }
    window.addEventListener("keydown", key)
    window.addEventListener("wheel", takeover, { passive: true })
    window.addEventListener("touchmove", takeover, { passive: true })
    return () => {
      window.removeEventListener("keydown", key)
      window.removeEventListener("wheel", takeover)
      window.removeEventListener("touchmove", takeover)
    }
  }, [active, index, go, close])

  const words = step.caption.split(" ")

  return (
    <AnimatePresence>
      {active && (
        <m.div key="tour" className="pointer-events-none fixed inset-0 z-[80]" initial="hide" animate="show" exit="hide">
          {/* top letterbox */}
          <m.div
            className="pointer-events-auto absolute inset-x-0 top-0 flex h-14 items-center justify-between bg-[#0b0b0a] px-5 font-mono text-[10px] uppercase tracking-label text-white/50 md:h-16 md:px-8"
            variants={{ hide: { y: "-100%" }, show: { y: 0 } }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <span className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
              In-flight tour
              <span className="hidden text-white/30 sm:inline">· {step.chapter}</span>
            </span>
            <span className="flex items-center gap-4">
              <span className="tabular-nums text-white/70">
                {pad(index + 1)} / {pad(TOUR.length)}
              </span>
              <button onClick={close} className="rounded-full border border-white/15 px-3 py-1.5 text-white/70 transition-colors hover:border-white hover:text-white">
                Exit · Esc
              </button>
            </span>
          </m.div>

          {/* bottom letterbox with captions */}
          <m.div
            className="pointer-events-auto absolute inset-x-0 bottom-0 bg-[#0b0b0a] px-5 pb-5 pt-4 text-[#F0ECE4] md:px-8 md:pb-6"
            variants={{ hide: { y: "100%" }, show: { y: 0 } }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {/* segmented progress */}
            <div className="mx-auto mb-4 flex max-w-[1400px] gap-1">
              {TOUR.map((_, i) => (
                <button key={i} onClick={() => go(i)} aria-label={`Go to stop ${i + 1}`} className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
                  {i < index && <span className="block h-full w-full bg-white/70" />}
                  {i === index && (
                    <span
                      key={`${index}`}
                      className="block h-full bg-accent"
                      style={{
                        animation: `tourbar ${dur}ms linear forwards`,
                        animationPlayState: playing ? "running" : "paused",
                      }}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="mx-auto flex max-w-[1400px] items-end gap-4 md:gap-8">
              <div className="min-w-0 flex-1">
                <p className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-label text-accent">
                  <span>✈</span> Captain Siddiq
                </p>
                <p aria-live="polite" className="min-h-[3.2em] font-serif text-xl leading-snug md:min-h-[2.4em] md:text-3xl">
                  <AnimatePresence mode="wait">
                    <m.span key={index} className="block" exit={{ opacity: 0, transition: { duration: 0.2 } }}>
                      {words.map((w, i) => (
                        <m.span
                          key={i}
                          className="inline-block whitespace-pre"
                          initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          transition={{ delay: 0.5 + i * 0.045, duration: 0.35 }}
                        >
                          {w + " "}
                        </m.span>
                      ))}
                    </m.span>
                  </AnimatePresence>
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  onClick={() => go(index - 1)}
                  disabled={index === 0}
                  aria-label="Previous stop"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white hover:text-white disabled:opacity-30"
                >
                  ←
                </button>
                <button
                  onClick={() => setPlaying((p) => !p)}
                  aria-label={playing ? "Pause tour" : "Resume tour"}
                  className="grid h-12 w-12 place-items-center rounded-full bg-accent text-white transition-transform hover:scale-105"
                >
                  {playing ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><rect x="2" y="1" width="3" height="10" /><rect x="7" y="1" width="3" height="10" /></svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M3 1l8 5-8 5z" /></svg>
                  )}
                </button>
                <button
                  onClick={() => go(index + 1)}
                  aria-label={index === TOUR.length - 1 ? "Finish tour" : "Next stop"}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white hover:text-white"
                >
                  {index === TOUR.length - 1 ? "✓" : "→"}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {!playing && (
                <m.p
                  className="mx-auto mt-3 max-w-[1400px] font-mono text-[10px] uppercase tracking-label text-white/40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Paused · press play or space to carry on
                </m.p>
              )}
            </AnimatePresence>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
