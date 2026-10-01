import { AnimatePresence, m, useMotionValue, useSpring } from "framer-motion"
import { useMemo, useState } from "react"
import { ALL_PROJECTS, Project } from "../../data/site"
import { EASE, Lines, Reveal } from "../ui/Motion"

const HUES = [12, 262, 174, 330, 214, 142, 38, 290, 196, 0, 90, 240]
const hueFor = (name: string) => HUES[name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % HUES.length]

function Row({ p, onEnter }: { p: Project; onEnter: (p: Project) => void }) {
  const link = p.appStoreLink || p.playStoreLink
  const Tag = link ? "a" : "div"
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -5% 0px" }}
      transition={{ duration: 0.7, ease: EASE }}
      onPointerEnter={() => onEnter(p)}
    >
      <Tag
        {...(link ? { href: link, target: "_blank", rel: "noreferrer", "data-cursor": "Open" } : { "data-cursor": "Private" })}
        className="group relative grid grid-cols-[3.5rem_1fr_auto] items-center gap-4 border-b border-line/10 py-5 md:grid-cols-[5rem_1.4fr_1.2fr_1fr_10rem] md:py-6"
      >
        <span className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-y-100" />
        <span className="relative font-mono text-[11px] text-accent">{p.id}</span>
        <span className="relative">
          <span className="block font-serif text-2xl transition-all duration-500 group-hover:translate-x-3 group-hover:text-paper md:text-4xl">
            {p.name}
          </span>
          <span className="mt-1 block text-xs text-muted transition-colors group-hover:text-paper/60 md:hidden">{p.sector}</span>
        </span>
        <span className="relative hidden text-sm text-muted transition-colors group-hover:text-paper/70 md:block">{p.summary}</span>
        <span className="relative hidden md:block">
          <span className="chip transition-colors group-hover:border-paper/20 group-hover:text-paper/70">{p.sector}</span>
        </span>
        <span className="relative flex items-center justify-end gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors group-hover:text-paper">
          <span className="hidden whitespace-nowrap lg:inline">{p.market ? p.market.country : "Private"}</span>
          <span className="grid h-8 w-8 place-items-center rounded-full border border-line/15 transition-all duration-500 group-hover:rotate-45 group-hover:border-paper/30">
            {link ? "↗" : "•"}
          </span>
        </span>
      </Tag>
    </m.div>
  )
}

export default function ProjectIndex() {
  const [hover, setHover] = useState<Project | null>(null)
  const [filter, setFilter] = useState("All")
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 180, damping: 22 })
  const sy = useSpring(y, { stiffness: 180, damping: 22 })

  const filters = useMemo(() => {
    const groups: Record<string, (p: Project) => boolean> = {
      All: () => true,
      Fintech: (p) => /fin|bank|corporate|rosca|saving|expense/i.test(p.about),
      Travel: (p) => /travel|airline|transit|commut/i.test(p.about),
      AI: (p) => /\bAI\b|ML/i.test(p.about),
      Sports: (p) => /sport|golf|tennis|pitch/i.test(p.about),
      Social: (p) => /social|match/i.test(p.about),
    }
    return groups
  }, [])

  const list = ALL_PROJECTS.filter(filters[filter])
  const hue = hover ? hueFor(hover.name) : 0

  return (
    <section
      id="index"
      className="relative px-5 py-28 md:px-8 md:py-40"
      onPointerMove={(e) => {
        x.set(e.clientX)
        y.set(e.clientY)
      }}
      onPointerLeave={() => setHover(null)}
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Reveal>
              <p className="label mb-6 flex items-center gap-3">
                <span className="h-px w-10 bg-accent" /> Project index
              </p>
            </Reveal>
            <Lines
              as="h2"
              className="font-serif text-5xl leading-[0.95] tracking-[-0.02em] md:text-8xl"
              lines={["Everything", <em key="e">I&apos;ve shipped.</em>]}
            />
          </div>
          <Reveal className="flex flex-wrap gap-2">
            {Object.keys(filters).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`relative rounded-full px-4 py-2 text-sm transition-colors ${filter === f ? "text-paper" : "text-ink/70 hover:text-ink"}`}
              >
                {filter === f && (
                  <m.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                )}
                <span className="relative">{f}</span>
              </button>
            ))}
          </Reveal>
        </div>

        <div className="mt-14 hidden grid-cols-[5rem_1.4fr_1fr_1fr_5rem] gap-4 border-b border-line/20 pb-3 font-mono text-[10px] uppercase tracking-label text-muted md:grid">
          <span>ID</span>
          <span>Project</span>
          <span>What it does</span>
          <span>Sector</span>
          <span className="text-right">Link</span>
        </div>

        <m.ul layout className="mt-4 md:mt-0">
          <AnimatePresence mode="popLayout">
            {list.map((p) => (
              <m.li key={p.id} layout exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4, ease: EASE }}>
                <Row p={p} onEnter={setHover} />
              </m.li>
            ))}
          </AnimatePresence>
        </m.ul>

        <p className="mt-6 font-mono text-[10px] uppercase tracking-label text-muted">
          {list.length} of {ALL_PROJECTS.length} entries · rows open the store listing
        </p>
      </div>

      {/* cursor-following preview card */}
      <m.div
        className="pointer-events-none fixed left-0 top-0 z-50 hidden md:block"
        style={{ x: sx, y: sy }}
        animate={{ opacity: hover ? 1 : 0, scale: hover ? 1 : 0.6 }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        <div className="ml-8 -mt-24 h-48 w-40 overflow-hidden rounded-[22px] p-2 shadow-2xl" style={{ background: `hsl(${hue} 80% 55%)` }}>
          <AnimatePresence mode="popLayout">
            {hover && (
              <m.div
                key={hover.id}
                className="flex h-full flex-col justify-between rounded-2xl p-4 text-white"
                style={{ background: `linear-gradient(160deg, hsl(${hue} 85% 60%), hsl(${(hue + 40) % 360} 70% 35%))` }}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] opacity-80">{hover.id}</span>
                <span className="font-serif text-6xl italic leading-none">{hover.name[0]}</span>
                <span className="text-[11px] leading-tight opacity-90">{hover.sector}</span>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </m.div>
    </section>
  )
}
