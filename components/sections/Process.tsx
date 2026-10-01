import { m, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { PROCESS } from "../../data/site"
import { EASE, Lines, Reveal } from "../ui/Motion"

export default function Process() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] })
  const line = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section className="relative px-5 py-28 md:px-8 md:py-40">
      <div className="mx-auto grid max-w-[1400px] gap-16 lg:grid-cols-[1fr_1.2fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal>
            <p className="label mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-accent" /> Process
            </p>
          </Reveal>
          <Lines
            as="h2"
            className="font-serif text-5xl leading-[0.95] tracking-[-0.02em] md:text-8xl"
            lines={["How we'd", <em key="e">work together.</em>]}
          />
          <Reveal delay={0.2} className="mt-8 max-w-sm text-lg text-ink/70">
            A free first call, a written plan with a clear price, then weekly builds until it&apos;s in the stores.
          </Reveal>
        </div>

        <div ref={ref} className="relative pl-10 md:pl-16">
          <span className="absolute left-[11px] top-2 h-[calc(100%-1rem)] w-px bg-line/10 md:left-[15px]" />
          <m.span
            className="absolute left-[11px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-accent md:left-[15px]"
            style={{ scaleY: line }}
          />
          <ol className="space-y-20 md:space-y-28">
            {PROCESS.map((s, i) => (
              <m.li
                key={s.code}
                className="relative"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px 0px -20% 0px" }}
                transition={{ duration: 0.9, ease: EASE }}
              >
                <m.span
                  className="absolute -left-10 top-1 grid h-6 w-6 place-items-center rounded-full border border-accent bg-paper md:-left-16 md:h-8 md:w-8"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "0px 0px -20% 0px" }}
                  transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
                >
                  <span className="h-2 w-2 rounded-full bg-accent" />
                </m.span>
                <p className="font-mono text-[11px] uppercase tracking-label text-accent">{s.code}</p>
                <h3 className="mt-3 font-serif text-4xl md:text-5xl">{s.title}</h3>
                <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted">{s.body}</p>
                <span className="pointer-events-none absolute -top-8 right-0 select-none font-serif text-[120px] leading-none text-outline opacity-40 md:text-[180px]">
                  {i + 1}
                </span>
              </m.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
