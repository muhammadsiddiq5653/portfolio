import { m } from "framer-motion"
import { MARKET_LIST, timeIn } from "../../data/site"
import { EASE, Lines, Reveal } from "../ui/Motion"
import { useNow } from "../ui/useNow"

function hourIn(tz: string, now: Date) {
  return Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: tz }).format(now)) % 24
}

function Dial({ tz, now }: { tz: string; now: Date | null }) {
  const parts = now
    ? new Intl.DateTimeFormat("en-GB", { hour: "numeric", minute: "numeric", hour12: false, timeZone: tz }).formatToParts(now)
    : []
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0) % 12
  const mnt = Number(parts.find((p) => p.type === "minute")?.value ?? 0)
  return (
    <svg viewBox="0 0 40 40" className="h-10 w-10 shrink-0">
      <circle cx="20" cy="20" r="18.5" fill="none" stroke="currentColor" strokeOpacity="0.2" />
      <line x1="20" y1="20" x2="20" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" transform={`rotate(${h * 30 + mnt * 0.5} 20 20)`} />
      <line x1="20" y1="20" x2="20" y2="6" stroke="rgb(var(--accent))" strokeWidth="1.2" strokeLinecap="round" transform={`rotate(${mnt * 6} 20 20)`} />
      <circle cx="20" cy="20" r="1.6" fill="currentColor" />
    </svg>
  )
}

export default function Markets() {
  const now = useNow(1000)
  const markets = MARKET_LIST.filter((mk) => mk.apps.length)
  const awake = now ? markets.filter((mk) => {
    const h = hourIn(mk.tz, now)
    return h >= 7 && h < 23
  }).length : 0

  return (
    <section className="relative overflow-hidden bg-night px-5 py-28 text-[#F0ECE4] md:px-8 md:py-40">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(rgb(255_255_255/0.12)_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className="relative mx-auto max-w-[1400px]">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <Reveal>
              <p className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-label text-white/50">
                <span className="h-px w-10 bg-accent" /> Around the clock
              </p>
            </Reveal>
            <Lines
              as="h2"
              className="font-serif text-5xl leading-[0.95] tracking-[-0.02em] md:text-8xl"
              lines={["Somewhere, it's", <em key="e">always morning.</em>]}
            />
          </div>
          <Reveal delay={0.15} className="max-w-md text-lg text-white/60 lg:justify-self-end">
            My apps are live in {markets.length} countries. Right now, people in{" "}
            <span className="text-white">{awake} of them</span> are awake and probably tapping something I built.
          </Reveal>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {markets.map((mk, i) => {
            const h = now ? hourIn(mk.tz, now) : 12
            const day = h >= 7 && h < 19
            return (
              <m.div
                key={mk.id}
                className="group relative flex items-center gap-5 bg-night p-6 transition-colors duration-500 hover:bg-[#1a1918]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: EASE, delay: (i % 3) * 0.08 }}
              >
                <Dial tz={mk.tz} now={now} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-serif text-2xl">{mk.city}</p>
                    <p className="font-mono text-sm tabular-nums text-white/80">{now ? timeIn(mk.tz, now) : "--:--"}</p>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
                    <span className="truncate">{mk.apps.join(" · ")}</span>
                    <span className={`shrink-0 ${day ? "text-amber-300" : "text-indigo-300"}`}>{day ? "☀ day" : "☾ night"}</span>
                  </div>
                </div>
              </m.div>
            )
          })}
          {markets.length % 3 !== 0 && (
            <a
              href="#contact"
              data-cursor="Say hi"
              className="group flex items-center gap-5 bg-night p-6 transition-colors duration-500 hover:bg-accent"
              style={{ gridColumn: `span ${3 - (markets.length % 3)} / span ${3 - (markets.length % 3)}` }}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-dashed border-white/30 text-lg">+</span>
              <span>
                <span className="block font-serif text-2xl">Your city next?</span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-white/40 group-hover:text-white/80">
                  Pin № {markets.length + 1} is open
                </span>
              </span>
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
