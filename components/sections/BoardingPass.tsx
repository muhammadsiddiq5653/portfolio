import { AnimatePresence, m, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useEffect, useMemo, useRef, useState } from "react"
import { HOME, timeIn, tzOffset } from "../../data/site"
import { EASE, Lines, Reveal } from "../ui/Motion"
import { scrollToTarget, useLenis } from "../ui/SmoothScroll"
import { useNow } from "../ui/useNow"

/** The visitor's typical working day, in their own time. */
const VISITOR_HOURS: [number, number] = [9, 18]

const hash = (s: string) => s.split("").reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7)
const fmtHour = (h: number) => `${String(Math.floor(((h % 24) + 24) % 24)).padStart(2, "0")}:${h % 1 ? "30" : "00"}`

function useVisitor() {
  const [tz, setTz] = useState<string | null>(null)
  useEffect(() => {
    try {
      setTz(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC")
    } catch {
      setTz("UTC")
    }
  }, [])
  const city = tz ? (tz.split("/").pop() || "UTC").replace(/_/g, " ") : "Your city"
  const code = city.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase() || "YOU"
  return { tz, city, code }
}

/** Fill a pass input, as if typed, so React and :placeholder-shown both notice. */
function fill(selector: string, value: string) {
  const el = document.querySelector<HTMLInputElement>(selector)
  if (!el || !value) return
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(el, value)
  el.dispatchEvent(new Event("input", { bubbles: true }))
}

export default function BoardingPass() {
  const lenis = useLenis()
  const now = useNow(1000)
  const visitor = useVisitor()
  const [name, setName] = useState("")
  const [torn, setTorn] = useState(false)
  const passRef = useRef<HTMLDivElement>(null)

  // 3D tilt + holographic sheen that follow the pointer
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rotateY = useSpring(useTransform(px, [0, 1], [-10, 10]), { stiffness: 150, damping: 18 })
  const rotateX = useSpring(useTransform(py, [0, 1], [8, -8]), { stiffness: 150, damping: 18 })
  const sheen = useTransform(
    [px, py] as any,
    ([x, y]: number[]) =>
      `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.55), transparent 40%), linear-gradient(${110 + x * 60}deg, rgba(255,0,128,0.18), rgba(0,200,255,0.18) 35%, rgba(255,220,0,0.18) 65%, rgba(120,0,255,0.18))`
  )

  const plan = useMemo(() => {
    if (!visitor.tz || !now) return null
    // hours Siddiq is ahead of the visitor (can be fractional, e.g. India)
    const diff = (tzOffset(HOME.tz, now) - tzOffset(visitor.tz, now)) / 60
    const hours = Array.from({ length: 24 }, (_, h) => {
      const his = (((h + diff) % 24) + 24) % 24
      const you = h >= VISITOR_HOURS[0] && h < VISITOR_HOURS[1]
      const me = his >= HOME.hours[0] && his < HOME.hours[1]
      return { h, you, me, both: you && me }
    })
    const overlap = hours.filter((x) => x.both)
    const best = overlap.length ? overlap[0].h : (((HOME.hours[0] - diff) % 24) + 24) % 24
    return { diff, hours, overlap: overlap.length, best }
  }, [visitor.tz, now])

  const passenger = (name.trim() || "Guest").toUpperCase()
  const seed = hash(passenger + visitor.code)
  const flight = `MS ${100 + (seed % 900)}`
  const seat = `${1 + (seed % 28)}${"ACDF"[seed % 4]}`
  const bars = Array.from({ length: 42 }, (_, i) => 1 + ((seed >> i % 24) + i * 7) % 3)

  const sameZone = plan && plan.diff === 0
  const diffLabel = plan
    ? sameZone
      ? "Same time zone"
      : `${HOME.city} is ${Math.abs(plan.diff)}h ${plan.diff > 0 ? "ahead" : "behind"}`
    : "Detecting your time zone…"

  const board = () => {
    if (torn) return
    setTorn(true)
    setTimeout(() => {
      scrollToTarget(lenis, "#contact")
      setTimeout(() => {
        fill('#contact input[name="name"]', name.trim())
        document.querySelector<HTMLInputElement>('#contact input[name="email"]')?.focus({ preventScroll: true })
      }, 1200)
    }, 1100)
  }

  return (
    <section className="relative overflow-hidden px-5 py-28 md:px-8 md:py-40">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]" />
      <div className="relative mx-auto grid max-w-[1400px] items-center gap-16 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Reveal>
            <p className="label mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-accent" /> Made for you
            </p>
          </Reveal>
          <Lines
            as="h2"
            className="font-serif text-5xl leading-[0.95] tracking-[-0.02em] md:text-7xl"
            lines={["Here's your", <em key="e">boarding pass.</em>]}
          />
          <Reveal delay={0.15} className="mt-8 max-w-md text-lg text-ink/70">
            This pass is printed for wherever you are right now. It shows the hours when your working day and mine
            overlap. Put your name on it, then tear off the stub when you&apos;re ready to talk.
          </Reveal>
          <Reveal delay={0.25} className="mt-8 max-w-sm">
            <label className="label mb-2 block">Passenger name</label>
            <input
              value={name}
              maxLength={24}
              onChange={(e) => setName(e.target.value)}
              placeholder="Type your name"
              className="w-full border-b border-line/20 bg-transparent pb-2 font-serif text-3xl outline-none transition-colors placeholder:text-ink/25 focus:border-accent"
            />
          </Reveal>
        </div>

        {/* the pass */}
        <div className="[perspective:1400px]">
          <m.div
            ref={passRef}
            className="relative mx-auto flex max-w-[760px] flex-col drop-shadow-[0_40px_60px_rgba(0,0,0,0.18)] md:flex-row"
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            initial={{ opacity: 0, y: 60, rotateZ: -4 }}
            whileInView={{ opacity: 1, y: 0, rotateZ: 0 }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: 1.2, ease: EASE }}
            onPointerMove={(e) => {
              if (e.pointerType !== "mouse") return
              const r = passRef.current!.getBoundingClientRect()
              px.set((e.clientX - r.left) / r.width)
              py.set((e.clientY - r.top) / r.height)
            }}
            onPointerLeave={() => {
              px.set(0.5)
              py.set(0.5)
            }}
          >
            {/* main ticket */}
            <div className="relative flex-1 overflow-hidden rounded-t-[28px] bg-[#FBFAF7] p-6 text-[#141311] md:rounded-l-[28px] md:rounded-tr-none md:p-8">
              <m.div className="pointer-events-none absolute inset-0 mix-blend-overlay" style={{ background: sheen }} />
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-black/50">
                <span className="flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-[#141311] font-serif text-xs italic text-white">S</span>
                  Siddiq Air · Boarding pass
                </span>
                <span>{flight}</span>
              </div>

              <div className="mt-6 flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/40">From</p>
                  <p className="font-serif text-6xl leading-none md:text-7xl">{visitor.code}</p>
                  <p className="mt-1 truncate text-sm text-black/60">
                    {visitor.city} · {visitor.tz && now ? timeIn(visitor.tz, now) : "--:--"}
                  </p>
                </div>
                <div className="relative mb-6 hidden flex-1 sm:block">
                  <div className="border-t-2 border-dashed border-black/15" />
                  <m.span
                    className="absolute -top-[13px] text-xl text-accent"
                    animate={{ left: ["0%", "92%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
                  >
                    ✈
                  </m.span>
                  <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-black/40">{diffLabel}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/40">To</p>
                  <p className="font-serif text-6xl leading-none md:text-7xl">{HOME.code}</p>
                  <p className="mt-1 text-sm text-black/60">
                    {HOME.city} · {now ? timeIn(HOME.tz, now) : "--:--"}
                  </p>
                </div>
              </div>

              {/* 24h overlap strip, in the visitor's local time */}
              <div className="mt-7">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-black/40">
                  <span>Your day · 24h</span>
                  <span className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-sm bg-black/15" />You</span>
                    <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-sm bg-[#7C5CFF]/50" />Me</span>
                    <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-sm bg-accent" />Both</span>
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-[repeat(24,minmax(0,1fr))] gap-[3px]">
                  {(plan?.hours ?? Array.from({ length: 24 }, (_, h) => ({ h, you: false, me: false, both: false }))).map((c, i) => (
                    <m.span
                      key={c.h}
                      title={`${fmtHour(c.h)} your time`}
                      className={`h-8 rounded-[4px] ${c.both ? "bg-accent" : c.me ? "bg-[#7C5CFF]/50" : c.you ? "bg-black/15" : "bg-black/[0.04]"}`}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.025, duration: 0.5, ease: EASE }}
                    />
                  ))}
                </div>
                <div className="mt-1 flex justify-between font-mono text-[9px] text-black/30">
                  <span>00</span>
                  <span>06</span>
                  <span>12</span>
                  <span>18</span>
                  <span>24</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-dashed border-black/15 pt-5 sm:grid-cols-4">
                {[
                  ["Passenger", passenger],
                  ["Shared hours", plan ? (plan.overlap ? `${plan.overlap}h / day` : "Async + 1 call") : "—"],
                  ["Best call", plan ? `${fmtHour(plan.best)} yours` : "—"],
                  ["Seat", seat],
                ].map(([k, v]) => (
                  <div key={k} className="min-w-0">
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/40">{k}</p>
                    <p className="mt-1 truncate font-medium">{v}</p>
                  </div>
                ))}
              </div>

              <AnimatePresence>
                {torn && (
                  <m.div
                    className="absolute inset-0 grid place-items-center bg-[#FBFAF7]/80 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <m.div
                      className="rotate-[-8deg] rounded-xl border-[3px] border-accent px-6 py-3 text-center font-mono text-xl font-bold uppercase tracking-[0.2em] text-accent"
                      initial={{ scale: 2.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 380, damping: 16, delay: 0.25 }}
                    >
                      Boarding
                      <span className="block text-[10px] tracking-[0.3em]">See you at the gate ↓</span>
                    </m.div>
                  </m.div>
                )}
              </AnimatePresence>
            </div>

            {/* perforation */}
            <div className="relative h-0 md:h-auto md:w-0">
              <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-paper md:-left-3 md:-top-3" />
              <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-paper md:-bottom-3 md:-left-3 md:right-auto md:top-auto" />
            </div>

            {/* tear-off stub */}
            <m.div
              className="relative flex cursor-grab touch-pan-y flex-row items-center justify-between gap-4 rounded-b-[28px] border-t-2 border-dashed border-black/15 bg-[#FBFAF7] p-6 text-[#141311] active:cursor-grabbing md:w-48 md:flex-col md:items-stretch md:rounded-r-[28px] md:rounded-bl-none md:border-l-2 md:border-t-0"
              drag={torn ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ left: 0.05, right: 0.7 }}
              onDragEnd={(_, info) => info.offset.x > 90 && board()}
              animate={torn ? { x: 260, y: 120, rotate: 28, opacity: 0 } : { x: 0 }}
              transition={{ duration: 0.9, ease: EASE }}
              data-cursor={torn ? "" : "Tear →"}
            >
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/40">Gate</p>
                <p className="font-serif text-4xl leading-none">Contact</p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-black/50">
                  {visitor.code} → {HOME.code}
                </p>
              </div>
              <div className="hidden h-14 items-end gap-[2px] md:flex" aria-hidden>
                {bars.map((w, i) => (
                  <span key={i} className="h-full bg-[#141311]" style={{ width: w }} />
                ))}
              </div>
              <button
                onClick={board}
                className="shrink-0 rounded-full bg-accent px-4 py-2.5 text-xs font-medium text-white transition-transform hover:scale-105"
              >
                Tear & board →
              </button>
            </m.div>
          </m.div>
          <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-label text-muted">
            Drag the stub to the right to tear it off
          </p>
        </div>
      </div>
    </section>
  )
}
