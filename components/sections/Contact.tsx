import { m, useScroll, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import { EMAIL, HOME, RESUME_URL, SOCIALS, timeIn } from "../../data/site"
import { EASE, Lines, Magnetic, Reveal } from "../ui/Motion"
import { scrollToTarget, useLenis } from "../ui/SmoothScroll"
import { useNow } from "../ui/useNow"

function Field({ name, label, type = "text", textarea }: { name: string; label: string; type?: string; textarea?: boolean }) {
  const cls =
    "peer w-full border-b border-white/15 bg-transparent pb-3 pt-6 text-lg text-white outline-none transition-colors placeholder:text-transparent focus:border-accent"
  return (
    <label className="relative block">
      {textarea ? (
        <textarea name={name} required rows={3} placeholder={label} className={`${cls} resize-none`} />
      ) : (
        <input name={name} type={type} required placeholder={label} className={cls} />
      )}
      <span className="pointer-events-none absolute left-0 top-6 text-lg text-white/40 transition-all duration-300 peer-focus:top-0 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-label peer-focus:text-accent peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-label">
        {label}
      </span>
    </label>
  )
}

export default function Contact() {
  const lenis = useLenis()
  const now = useNow()
  const [copied, setCopied] = useState(false)
  const footRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: footRef, offset: ["start end", "end end"] })
  const nameY = useTransform(scrollYProgress, [0, 1], ["60%", "0%"])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${EMAIL}`
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden rounded-t-[40px] bg-night text-[#F0ECE4] md:rounded-t-[64px]">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/30 blur-[160px]" />

      <div className="relative mx-auto max-w-[1400px] px-5 pb-16 pt-28 md:px-8 md:pt-40">
        <Reveal>
          <p className="mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-label text-white/50">
            <span className="h-2 w-2 animate-pulseDot rounded-full bg-green-500" /> Contact · open to work
          </p>
        </Reveal>
        <Lines
          as="h2"
          className="font-serif text-[15vw] leading-[0.88] tracking-[-0.03em] md:text-[9vw] 2xl:text-[150px]"
          lines={["Your app could", <em key="e">be pin № 12.</em>]}
        />

        <div className="mt-20 grid gap-16 lg:grid-cols-[1fr_1fr]">
          <div>
            <Reveal className="max-w-md text-lg text-white/60">
              Building something people will rely on? A call across time zones works for me. I&apos;m open to senior
              mobile roles and select freelance projects.
            </Reveal>

            <Reveal delay={0.1} className="mt-10">
              <Magnetic strength={0.2}>
                <button
                  onClick={copy}
                  data-cursor={copied ? "Copied" : "Copy"}
                  className="group relative block text-left"
                >
                  <span className="block font-mono text-[11px] uppercase tracking-label text-white/40">
                    {copied ? "Copied to clipboard ✓" : "Email · click to copy"}
                  </span>
                  <span className="relative mt-2 block font-serif text-3xl md:text-5xl">
                    {EMAIL}
                    <span className="absolute -bottom-2 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-x-100" />
                  </span>
                </button>
              </Magnetic>
            </Reveal>

            <Reveal delay={0.2} className="mt-14 grid grid-cols-2 gap-8 font-mono text-[11px] uppercase tracking-label text-white/40 sm:grid-cols-3">
              <div>
                <p>Elsewhere</p>
                <ul className="mt-3 space-y-2 normal-case tracking-normal">
                  {SOCIALS.map((s) => (
                    <li key={s.name}>
                      <a href={s.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 font-sans text-base text-white/80 hover:text-white">
                        {s.name}
                        <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p>Local time</p>
                <p className="mt-3 font-sans text-base normal-case tracking-normal text-white/80 tabular-nums">
                  {now ? timeIn(HOME.tz, now) : "--:--"} · {HOME.label}
                </p>
              </div>
              <div>
                <p>Résumé</p>
                <a href={RESUME_URL} target="_blank" rel="noreferrer" className="mt-3 inline-block font-sans text-base normal-case tracking-normal text-white/80 hover:text-white">
                  View PDF ↗
                </a>
              </div>
            </Reveal>
          </div>

          <m.form
            action="https://formsubmit.co/b8e64647abbe4a2a4830ff3022995db4"
            method="POST"
            className="space-y-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur md:p-10"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
          >
            <p className="font-mono text-[11px] uppercase tracking-label text-white/40">Or send a message</p>
            <Field name="name" label="Your name" />
            <Field name="email" label="Email" type="email" />
            <Field name="message" label="What are you building?" textarea />
            <input type="hidden" name="_captcha" value="false" />
            <button
              type="submit"
              data-cursor="Send"
              className="group relative flex h-14 w-full items-center justify-center overflow-hidden rounded-full bg-accent font-medium text-white"
            >
              <span className="absolute inset-0 translate-y-full bg-white transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0" />
              <span className="relative transition-colors duration-500 group-hover:text-black">Send message →</span>
            </button>
          </m.form>
        </div>
      </div>

      {/* footer */}
      <div ref={footRef} className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-5 py-6 font-mono text-[10px] uppercase tracking-label text-white/40 md:px-8">
          <span>© {new Date().getFullYear()} Muhammad Siddiq</span>
          <span>Designed & built with Next.js, Framer Motion & WebGL</span>
          <button onClick={() => scrollToTarget(lenis, 0)} className="hover:text-white" data-cursor="Top">
            Back to top ↑
          </button>
        </div>
        <div className="overflow-hidden">
          <m.p
            style={{ y: nameY }}
            className="select-none whitespace-nowrap text-center font-serif text-[26vw] italic leading-[0.8] tracking-[-0.04em] text-white/[0.06]"
          >
            Siddiq.
          </m.p>
        </div>
      </div>
    </section>
  )
}
