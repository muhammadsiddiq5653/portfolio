import { AnimatePresence, m } from "framer-motion"
import { useEffect, useState } from "react"
import { GREETINGS } from "../../data/site"
import { EASE } from "./Motion"
import { useLenis } from "./SmoothScroll"

/** Greets in the languages of the markets, counts to 100, then lifts away. */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0)
  const [word, setWord] = useState(0)
  const [visible, setVisible] = useState(true)
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return
    if (visible) lenis.stop()
    else lenis.start()
  }, [lenis, visible])

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false)
      onDone()
      return
    }
    document.documentElement.style.overflow = "hidden"
    const start = performance.now()
    const total = 2100
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / total)
      const eased = 1 - Math.pow(1 - t, 3)
      setCount(Math.round(eased * 100))
      setWord(Math.min(GREETINGS.length - 1, Math.floor(t * GREETINGS.length)))
      if (t < 1) frame = requestAnimationFrame(tick)
      else
        setTimeout(() => {
          setVisible(false)
          document.documentElement.style.overflow = ""
          onDone()
        }, 250)
    }
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      document.documentElement.style.overflow = ""
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          key="preloader"
          className="fixed inset-0 z-[90] flex flex-col justify-between bg-night p-6 text-[#F0ECE4] md:p-10"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1, ease: EASE }}
        >
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-label text-white/50">
            <span>Muhammad Siddiq — Portfolio</span>
            <span>Loading markets</span>
          </div>

          <div className="flex items-center justify-center">
            <AnimatePresence mode="wait">
              <m.span
                key={word}
                className="flex items-center gap-4 font-serif text-6xl md:text-8xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.18 }}
              >
                <span className="h-3 w-3 rounded-full bg-accent" />
                {GREETINGS[word]}
              </m.span>
            </AnimatePresence>
          </div>

          <div className="flex items-end justify-between">
            <div className="h-px w-1/2 bg-white/15">
              <div className="h-px bg-accent" style={{ width: `${count}%` }} />
            </div>
            <span className="font-serif text-7xl leading-none tabular-nums md:text-9xl">
              {count}
              <span className="text-accent">%</span>
            </span>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
