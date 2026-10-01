import { m, useScroll, useTransform } from "framer-motion"
import dynamic from "next/dynamic"
import { useRef } from "react"
import { ALL_PROJECTS, HOME, MARKETS, STATS, timeIn } from "../../data/site"
import { Counter, EASE, Lines, PillButton } from "../ui/Motion"
import { scrollToTarget, useLenis } from "../ui/SmoothScroll"
import { useNow } from "../ui/useNow"

const Globe = dynamic(() => import("../ui/Globe"), { ssr: false })

const FLOATERS = [
  { text: "Dubai · 3 apps", className: "left-[4%] top-[22%]", delay: 0 },
  { text: "Osaka · boarding pass", className: "right-[2%] top-[38%]", delay: 1.2 },
  { text: "Karachi · savings", className: "left-[10%] bottom-[18%]", delay: 2.1 },
  { text: "Riyadh · rewards", className: "right-[14%] bottom-[8%]", delay: 0.6 },
]

export default function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const lenis = useLenis()
  const now = useNow()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const nameY = useTransform(scrollYProgress, [0, 1], [0, -160])
  const globeY = useTransform(scrollYProgress, [0, 1], [0, 220])
  const globeScale = useTransform(scrollYProgress, [0, 1], [1, 0.8])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const d = (s: number) => ({ duration: 1, ease: EASE, delay: ready ? s : 99 })

  return (
    <section ref={ref} id="top" className="relative min-h-[100svh] overflow-hidden bg-grid pt-24 md:pt-28">
      {/* glow */}
      <div className="pointer-events-none absolute -right-40 top-10 h-[700px] w-[700px] rounded-full bg-accent/20 blur-[140px]" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[500px] w-[500px] rounded-full bg-[#7C5CFF]/10 blur-[140px]" />

      <div className="relative mx-auto flex min-h-[calc(100svh-7rem)] max-w-[1400px] flex-col px-5 md:px-8">
        {/* ticker */}
        <m.div
          className="flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-line/10 py-3 font-mono text-[10px] uppercase tracking-label text-muted md:text-[11px]"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : undefined}
          transition={d(0.9)}
        >
          <span className="flex items-center gap-2 text-ink">
            <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-green-500" />
            Live in production
          </span>
          <span>{ALL_PROJECTS.length} apps</span>
          <span className="hidden sm:inline">{Object.keys(MARKETS).length} countries</span>
          <span className="ml-auto tabular-nums">
            {HOME.label} · {now ? timeIn(HOME.tz, now, true) : "--:--:--"}
          </span>
        </m.div>

        <div className="relative grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.15fr_1fr] lg:py-0">
          {/* copy */}
          <m.div style={{ y: nameY, opacity: fade }} className="relative z-10">
            <m.p
              className="label mb-6 flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={ready ? { opacity: 1, x: 0 } : undefined}
              transition={d(0.2)}
            >
              <span className="h-px w-10 bg-accent" />
              Mobile & full-stack engineer
            </m.p>

            <Lines
              as="h1"
              immediate={ready}
              delay={0.25}
              stagger={0.12}
              className="font-serif text-[18vw] leading-[0.86] tracking-[-0.03em] sm:text-[15vw] lg:text-[9.5vw] 2xl:text-[150px]"
              lines={[
                "Muhammad",
                <span key="s" className="pl-[0.6em] italic">
                  Siddiq<span className="not-italic text-accent">.</span>
                </span>,
              ]}
            />

            <m.p
              className="mt-8 max-w-md text-lg leading-relaxed text-ink/75 md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={ready ? { opacity: 1, y: 0 } : undefined}
              transition={d(0.7)}
            >
              I build the apps people open every day to{" "}
              <em className="font-serif text-[1.15em] text-ink">save, bank, travel and get paid</em>, shipped to{" "}
              {Object.keys(MARKETS).length} countries, from Karachi to Osaka.
            </m.p>

            <m.div
              className="mt-10 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={ready ? { opacity: 1, y: 0 } : undefined}
              transition={d(0.85)}
            >
              <PillButton
                href="#work"
                cursor="Scroll"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToTarget(lenis, "#work")
                }}
              >
                See the work
                <span className="transition-transform duration-500 group-hover:translate-y-0.5">↓</span>
              </PillButton>
              <PillButton
                variant="ghost"
                href="#contact"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToTarget(lenis, "#contact")
                }}
              >
                Get in touch
              </PillButton>
            </m.div>
          </m.div>

          {/* globe */}
          <div className="relative mx-auto w-full max-w-[560px] lg:absolute lg:-right-16 lg:top-1/2 lg:w-[52%] lg:max-w-[720px] lg:-translate-y-1/2">
          <m.div
            className="relative"
            style={{ y: globeY, scale: globeScale }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={ready ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 1.6, ease: EASE, delay: ready ? 0.3 : 99 }}
          >
            <Globe />
            {FLOATERS.map((f) => (
              <m.span
                key={f.text}
                className={`absolute hidden rounded-full border border-line/10 bg-paper/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/80 shadow-sm backdrop-blur md:block ${f.className}`}
                initial={{ opacity: 0, y: 10 }}
                animate={ready ? { opacity: 1, y: [0, -8, 0] } : undefined}
                transition={{
                  opacity: { duration: 0.6, delay: 1.4 + f.delay * 0.3 },
                  y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: f.delay },
                }}
              >
                <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" />
                {f.text}
              </m.span>
            ))}
          </m.div>
          </div>
        </div>

        {/* stats */}
        <div className="relative z-10 grid grid-cols-2 gap-3 pb-8 md:grid-cols-4">
          {STATS.map((s, i) => (
            <m.div
              key={s.label}
              className="group rounded-2xl border border-line/10 bg-paper/60 p-4 backdrop-blur-md transition-colors duration-500 hover:border-accent/50 md:p-5"
              initial={{ opacity: 0, y: 30 }}
              animate={ready ? { opacity: 1, y: 0 } : undefined}
              transition={d(1 + i * 0.08)}
            >
              <span className="font-mono text-[10px] text-muted">M_0{i + 1}</span>
              <div className="mt-2 font-serif text-4xl md:text-5xl">
                {ready ? <Counter to={s.value} suffix={s.suffix} /> : 0}
                {i < 2 && <span className="text-accent">+</span>}
              </div>
              <p className="mt-1 text-xs text-muted md:text-sm">{s.label}</p>
            </m.div>
          ))}
        </div>
      </div>

      <m.div
        className="absolute bottom-6 right-6 hidden items-center gap-3 font-mono text-[10px] uppercase tracking-label text-muted md:flex"
        style={{ opacity: fade }}
      >
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-line/15">
          <m.span
            className="absolute left-0 top-0 h-4 w-px bg-accent"
            animate={{ y: [-16, 40] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </m.div>
    </section>
  )
}
