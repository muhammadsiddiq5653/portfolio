import { AnimatePresence, m, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { ALL_PROJECTS, FEATURED, timeIn } from "../../data/site"
import { EASE, Lines, Reveal } from "../ui/Motion"
import PhoneScreen from "../ui/PhoneScreen"
import { scrollToTarget, useLenis } from "../ui/SmoothScroll"
import { useNow } from "../ui/useNow"

const N = FEATURED.length
const pad = (n: number) => String(n).padStart(2, "0")

function Phone({ index, tiltY }: { index: number; tiltY: any }) {
  const p = FEATURED[index]
  return (
    <m.div className="relative [perspective:1600px]" style={{ rotateY: tiltY }}>
      <div
        className="relative h-[620px] w-[300px] rounded-[54px] p-[10px] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.45),inset_0_0_0_1.5px_rgba(255,255,255,0.25)]"
        style={{ background: "linear-gradient(145deg,#3a3a3c,#151516 45%,#2a2a2c)" }}
      >
        {/* side buttons */}
        <span className="absolute -left-[3px] top-28 h-8 w-[3px] rounded-l bg-[#2a2a2c]" />
        <span className="absolute -left-[3px] top-40 h-14 w-[3px] rounded-l bg-[#2a2a2c]" />
        <span className="absolute -right-[3px] top-36 h-20 w-[3px] rounded-r bg-[#2a2a2c]" />
        <div className="relative h-full w-full overflow-hidden rounded-[44px] bg-black">
          <AnimatePresence mode="popLayout" initial={false}>
            <m.div
              key={p.name}
              className="absolute inset-0"
              initial={{ clipPath: "inset(100% 0 0 0)", scale: 1.08 }}
              animate={{ clipPath: "inset(0% 0 0 0)", scale: 1 }}
              exit={{ opacity: 0.4, scale: 0.94 }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <PhoneScreen kind={p.kind} accent={p.accent} name={p.name} />
            </m.div>
          </AnimatePresence>
          {/* dynamic island */}
          <span className="absolute left-1/2 top-3 z-20 h-[26px] w-[92px] -translate-x-1/2 rounded-full bg-black" />
          {/* glass */}
          <span className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(115deg,rgba(255,255,255,0.18)_0%,transparent_30%,transparent_70%,rgba(255,255,255,0.06)_100%)]" />
        </div>
      </div>
    </m.div>
  )
}

export default function Work() {
  const ref = useRef<HTMLElement>(null)
  const lenis = useLenis()
  const now = useNow()
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 20 })
  const tiltY = useTransform(smooth, (v) => Math.sin(v * N * Math.PI) * 9)
  const floatY = useTransform(smooth, (v) => Math.cos(v * N * Math.PI * 2) * 10)
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(N - 1, Math.max(0, Math.floor(v * N)))
    setActive((prev) => (prev === i ? prev : i))
  })

  const jump = (i: number) => {
    const el = ref.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const span = el.offsetHeight - window.innerHeight
    scrollToTarget(lenis, top + (span * (i + 0.5)) / N)
  }

  const switcherRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const bar = switcherRef.current
    const chip = bar?.children[active] as HTMLElement | undefined
    if (bar && chip) bar.scrollTo({ left: chip.offsetLeft - bar.clientWidth / 2 + chip.clientWidth / 2, behavior: "smooth" })
  }, [active])

  const p = FEATURED[active]

  return (
    <>
      <section id="work" className="relative px-5 pb-10 pt-32 md:px-8 md:pt-48">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <p className="label mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-accent" /> Selected work · {pad(N)} of {ALL_PROJECTS.length}
            </p>
          </Reveal>
          <Lines
            as="h2"
            className="max-w-5xl font-serif text-5xl leading-[0.95] tracking-[-0.02em] md:text-8xl"
            lines={["Apps people open", <em key="e">before their coffee.</em>]}
          />
          <Reveal delay={0.2} className="mt-8 max-w-xl text-lg text-ink/70">
            Banking in Dubai, a family savings circle in Karachi, a boarding pass in Osaka. Keep scrolling and the phone
            moves through them.
          </Reveal>
        </div>
      </section>

      <section ref={ref} className="relative" style={{ height: `${N * 100}svh` }}>
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          {/* accent wash */}
          <m.div
            className="pointer-events-none absolute inset-0"
            animate={{
              background: `radial-gradient(60% 55% at 70% 50%, ${p.accent}2e, transparent 70%)`,
            }}
            transition={{ duration: 1 }}
          />
          {/* huge index number */}
          <div className="pointer-events-none absolute -bottom-10 left-0 select-none font-serif text-[38vw] leading-none text-outline opacity-60 md:text-[26vw]">
            <AnimatePresence mode="popLayout" initial={false}>
              <m.span
                key={active}
                className="block"
                initial={{ y: "40%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-40%", opacity: 0 }}
                transition={{ duration: 0.9, ease: EASE }}
              >
                {pad(active + 1)}
              </m.span>
            </AnimatePresence>
          </div>

          <div className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-center gap-6 px-5 pb-24 pt-20 md:px-8 lg:grid lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-10 lg:pb-16 lg:pt-24">
            {/* text */}
            <div className="relative z-10 order-2 lg:order-1">
              <AnimatePresence mode="wait">
                <m.div
                  key={p.name}
                  initial="hide"
                  animate="show"
                  exit="exit"
                  variants={{
                    show: { transition: { staggerChildren: 0.06 } },
                    exit: { transition: { staggerChildren: 0.03 } },
                  }}
                >
                  {[
                    <div key="meta" className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-label text-muted">
                      <span className="text-accent">
                        {pad(active + 1)} / {pad(N)}
                      </span>
                      <span>{p.sector}</span>
                    </div>,
                    <h3 key="h" className="mt-3 max-w-xl font-serif text-[1.65rem] leading-[1.04] sm:text-[2rem] lg:mt-4 tracking-[-0.01em] md:text-6xl">
                      {p.headline}
                    </h3>,
                    <div key="name" className="mt-4 flex items-center gap-4 lg:mt-6">
                      <span
                        className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl font-serif text-xl italic text-white shadow-lg"
                        style={{ background: p.accent }}
                      >
                        {p.name[0]}
                      </span>
                      <div>
                        <p className="text-lg font-medium">{p.name}</p>
                        <p className="text-sm text-muted">
                          {p.contribution.join(" · ")}
                          {p.market ? ` · ${p.market.country}` : ""}
                        </p>
                      </div>
                    </div>,
                    <div key="chips" className="mt-5 hidden flex-wrap gap-2 sm:flex">
                      {p.stack.map((s) => (
                        <span key={s} className="chip">
                          {s}
                        </span>
                      ))}
                    </div>,
                    <div key="links" className="mt-4 flex flex-wrap gap-2 lg:mt-6">
                      {p.appStoreLink && (
                        <a href={p.appStoreLink} target="_blank" rel="noreferrer" data-cursor="Open" className="rounded-full border border-line/15 px-4 py-2 text-sm transition-colors hover:border-ink hover:bg-ink hover:text-paper">
                          App Store ↗
                        </a>
                      )}
                      {p.playStoreLink && (
                        <a href={p.playStoreLink} target="_blank" rel="noreferrer" data-cursor="Open" className="rounded-full border border-line/15 px-4 py-2 text-sm transition-colors hover:border-ink hover:bg-ink hover:text-paper">
                          Google Play ↗
                        </a>
                      )}
                    </div>,
                  ].map((child, i) => (
                    <m.div
                      key={i}
                      variants={{
                        hide: { opacity: 0, y: 24, filter: "blur(6px)" },
                        show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE } },
                        exit: { opacity: 0, y: -16, filter: "blur(4px)", transition: { duration: 0.3 } },
                      }}
                    >
                      {child}
                    </m.div>
                  ))}
                </m.div>
              </AnimatePresence>
            </div>

            {/* phone + viewfinder */}
            <div className="relative order-1 flex items-center justify-center lg:order-2 lg:h-full">
              <div className="pointer-events-none absolute inset-y-[4%] left-1/2 hidden w-[min(560px,100%)] -translate-x-1/2 md:block">
                {["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "left-0 bottom-0 border-b border-l", "right-0 bottom-0 border-b border-r"].map((c) => (
                  <span key={c} className={`absolute h-8 w-8 border-ink/40 ${c}`} />
                ))}
                <span className="absolute left-10 top-2 font-mono text-[10px] uppercase tracking-label text-muted">
                  [ {p.market ? `${p.market.city} · ${p.market.coords[0].toFixed(2)}°, ${p.market.coords[1].toFixed(2)}°` : "Worldwide"} ]
                </span>
                <span className="absolute bottom-2 right-10 font-mono text-[10px] uppercase tracking-label text-muted tabular-nums">
                  Local {p.market && now ? timeIn(p.market.tz, now) : "--:--"}
                </span>
              </div>
              <m.div style={{ y: floatY }}>
                {/* box sized to the scaled phone so layout matches what you see */}
                <div className="relative h-[298px] w-[144px] sm:h-[384px] sm:w-[186px] md:h-[496px] md:w-[240px] xl:h-[570px] xl:w-[276px]">
                  <div className="absolute left-0 top-0 origin-top-left scale-[0.48] sm:scale-[0.62] md:scale-[0.8] xl:scale-[0.92]">
                    <Phone index={active} tiltY={tiltY} />
                  </div>
                </div>
              </m.div>
            </div>
          </div>

          {/* app switcher */}
          <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-5 md:px-8">
            <div className="mx-auto max-w-[1400px]">
              <div className="relative mb-3 h-px bg-line/10">
                <m.div className="absolute inset-y-0 left-0 bg-accent" style={{ width: bar }} />
              </div>
              <div ref={switcherRef} className="relative flex gap-1.5 overflow-x-auto [scrollbar-width:none]">
                {FEATURED.map((f, i) => (
                  <button
                    key={f.name}
                    onClick={() => jump(i)}
                    data-cursor=""
                    className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-all duration-500 ${
                      i === active ? "border-ink bg-ink text-paper" : "border-line/10 text-muted hover:border-line/40"
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full" style={{ background: f.accent }} />
                    {f.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
