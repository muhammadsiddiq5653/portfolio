import { m, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "framer-motion"
import Image from "next/image"
import { useRef } from "react"
import { SYSTEMS, TECH_LOGOS } from "../../data/site"
import { Lines, Reveal } from "../ui/Motion"

const label = (s: string) =>
  s
    .replace("-", " ")
    .replace("nextjs", "Next.js")
    .replace("nodejs", "Node.js")
    .replace("nestjs", "NestJS")
    .replace("graphql", "GraphQL")
    .replace("postgresql", "PostgreSQL")
    .replace("mongodb", "MongoDB")
    .replace("tailwindcss", "Tailwind")
    .replace("javascript", "JavaScript")
    .replace("typescript", "TypeScript")
    .replace("sqlite", "SQLite")
    .replace("github", "GitHub")

/** A row that drifts constantly and speeds up (or reverses) with scroll velocity. */
function VelocityRow({ items, base }: { items: string[]; base: number }) {
  const x = useMotionValue(0)
  const { scrollY } = useScroll()
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const factor = useTransform(vel, [-1000, 0, 1000], [-4, 0, 4], { clamp: false })
  const dir = useRef(1)
  const trackRef = useRef<HTMLDivElement>(null)

  useAnimationFrame((_, delta) => {
    const f = factor.get()
    if (f < 0) dir.current = -1
    else if (f > 0) dir.current = 1
    let move = dir.current * base * (delta / 1000)
    move += move * Math.abs(f)
    const half = (trackRef.current?.scrollWidth ?? 0) / 2
    if (!half) return
    let next = x.get() - move
    if (next <= -half) next += half
    if (next > 0) next -= half
    x.set(next)
  })

  return (
    <div className="flex overflow-hidden py-3">
      <m.div ref={trackRef} className="flex shrink-0 gap-4 pr-4" style={{ x }}>
        {[...items, ...items].map((t, i) => (
          <div
            key={i}
            className="group flex shrink-0 items-center gap-4 rounded-full border border-line/10 bg-paper2/60 py-3 pl-3 pr-7 transition-colors duration-500 hover:border-accent hover:bg-accent/10"
          >
            <span className="relative grid h-11 w-11 place-items-center rounded-full bg-white shadow-sm">
              <span className="relative h-6 w-6">
                <Image src={`/images/${t}.svg`} alt="" fill sizes="24px" />
              </span>
            </span>
            <span className="whitespace-nowrap font-serif text-3xl capitalize md:text-4xl">{label(t)}</span>
          </div>
        ))}
      </m.div>
    </div>
  )
}

export default function Stack() {
  const half = Math.ceil(TECH_LOGOS.length / 2)
  return (
    <section id="stack" className="relative overflow-hidden py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <Reveal>
          <p className="label mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-accent" /> Toolkit
          </p>
        </Reveal>
        <Lines
          as="h2"
          className="font-serif text-5xl leading-[0.95] tracking-[-0.02em] md:text-8xl"
          lines={["Tools I trust", <em key="e">with your users.</em>]}
        />
      </div>

      <div className="mt-16 -rotate-2 space-y-1">
        <VelocityRow items={TECH_LOGOS.slice(0, half)} base={60} />
        <VelocityRow items={TECH_LOGOS.slice(half).reverse()} base={-45} />
      </div>

      <div className="px-5 md:px-8">
      <div className="mx-auto mt-24 grid max-w-[1400px] gap-px overflow-hidden rounded-3xl border border-line/10 bg-line/10 md:grid-cols-2 xl:grid-cols-4">
        {SYSTEMS.map((s, i) => (
          <Reveal key={s.id} delay={i * 0.08} className="h-full">
            <div className="group relative h-full overflow-hidden bg-paper p-7 md:p-8">
              <span className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-accent/0 blur-3xl transition-colors duration-700 group-hover:bg-accent/25" />
              <span className="font-mono text-[10px] text-accent">{s.id}</span>
              <h3 className="mt-10 font-serif text-3xl">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{s.body}</p>
              <div className="mt-6 flex flex-wrap gap-1.5">
                {s.tags.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      </div>
    </section>
  )
}
