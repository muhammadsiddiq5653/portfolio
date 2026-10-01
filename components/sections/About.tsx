import { m, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { useRef } from "react"
import { RESUME_URL } from "../../data/site"
import { EASE, PillButton, Reveal, ScrollWords } from "../ui/Motion"

export default function About() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const imgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"])
  const rotate = useTransform(scrollYProgress, [0, 1], [-6, 6])

  return (
    <section id="about" className="relative overflow-hidden px-5 py-28 md:px-8 md:py-40">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <p className="label mb-10 flex items-center gap-3">
            <span className="h-px w-10 bg-accent" /> About · Salam 👋
          </p>
        </Reveal>

        <ScrollWords
          className="max-w-6xl font-serif text-[2.2rem] leading-[1.08] tracking-[-0.01em] md:text-7xl"
          text="I'm a mobile engineer who turns ideas into apps that feel calm, fast and trustworthy, especially where money, travel and people's daily routines are involved."
        />

        <div ref={ref} className="mt-24 grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <m.div
            className="group relative mx-auto aspect-[4/5] w-full max-w-md"
            style={{ rotate }}
            initial={{ clipPath: "inset(100% 0 0 0 round 28px)" }}
            whileInView={{ clipPath: "inset(0% 0 0 0 round 28px)" }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: 1.4, ease: EASE }}
            data-cursor="Hi!"
          >
            <m.div className="absolute inset-[-12%]" style={{ y: imgY }}>
              <Image
                src="/images/me____.jpg"
                alt="Muhammad Siddiq"
                fill
                sizes="(max-width: 1024px) 90vw, 450px"
                className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
              />
            </m.div>
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl bg-paper/85 px-4 py-3 backdrop-blur-md">
              <span>
                <span className="block text-sm font-medium">Muhammad Siddiq</span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Remote · worldwide</span>
              </span>
              <span className="h-2 w-2 animate-pulseDot rounded-full bg-green-500" />
            </div>
          </m.div>

          <div className="space-y-6 text-lg leading-relaxed text-ink/75 md:text-xl">
            <Reveal>
              <p>
                I build high-impact mobile apps for startups and companies, working remotely with teams across the Gulf,
                Asia, Europe and North America. I work in <span className="text-ink">Flutter, Kotlin, Swift and React Native</span>,
                and pick up the backend and web pieces when the product needs them.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                What I care about: user-facing features that feel obvious, code that scales past version one, and
                performance you notice when it&apos;s missing. Good design and good engineering, in the same pull request.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p>
                I like bringing a team toward the same goal, and I measure success by one thing: an app that does what
                the client needed and then a bit more.
              </p>
            </Reveal>
            <Reveal delay={0.3} className="pt-4">
              <PillButton href={RESUME_URL} external cursor="Open">
                View résumé <span>↗</span>
              </PillButton>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
