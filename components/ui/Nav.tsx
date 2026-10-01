import { AnimatePresence, m, useMotionValueEvent, useScroll, useSpring } from "framer-motion"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { RESUME_URL } from "../../data/site"
import { EASE } from "./Motion"
import { scrollToTarget, useLenis } from "./SmoothScroll"

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#index", label: "Index" },
  { href: "#stack", label: "Stack" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
]

export default function Nav({ ready }: { ready: boolean }) {
  const lenis = useLenis()
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isDark = mounted && resolvedTheme === "dark"

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > 300 && y > prev && !open)
  })

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    setOpen(false)
    scrollToTarget(lenis, href)
  }

  return (
    <>
      <m.div className="fixed left-0 right-0 top-0 z-[70] h-[2px] origin-left bg-accent" style={{ scaleX: progress }} />

      <m.header
        className="fixed inset-x-0 top-0 z-[65] px-4 pt-4 md:px-8 md:pt-5"
        initial={{ y: -100, opacity: 0 }}
        animate={ready ? { y: hidden ? -110 : 0, opacity: 1 } : undefined}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <nav className="mx-auto flex max-w-[1400px] items-center justify-between gap-4">
          <a href="#top" onClick={(e) => go(e, "#top")} className="group flex items-center gap-3" data-cursor="">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-ink font-serif text-lg italic text-paper transition-transform duration-500 group-hover:rotate-[360deg]">
              S
            </span>
            <span className="hidden text-sm font-medium leading-tight sm:block">
              Muhammad Siddiq
              <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Mobile · Full stack</span>
            </span>
          </a>

          <div className="hidden items-center gap-1 rounded-full border border-line/10 bg-paper/70 p-1 backdrop-blur-xl md:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => go(e, l.href)}
                className="group relative overflow-hidden rounded-full px-4 py-2 text-sm text-ink/70 transition-colors hover:text-ink"
              >
                <span className="block transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-full">
                  {l.label}
                </span>
                <span className="absolute inset-x-0 top-full block px-4 py-2 text-ink transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-full">
                  {l.label}
                </span>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              onClick={(e) => go(e, "#contact")}
              className="hidden items-center gap-2 rounded-full border border-line/10 bg-paper/70 px-4 py-2.5 text-xs backdrop-blur-xl lg:flex"
            >
              <span className="h-2 w-2 animate-pulseDot rounded-full bg-green-500" />
              Open to work
            </a>
            <button
              aria-label="Toggle theme"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="grid h-10 w-10 place-items-center rounded-full border border-line/10 bg-paper/70 backdrop-blur-xl"
            >
              <m.svg
                key={String(isDark)}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                {isDark ? (
                  <>
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                  </>
                ) : (
                  <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
                )}
              </m.svg>
            </button>
            <button
              aria-label="Menu"
              onClick={() => setOpen((o) => !o)}
              className="grid h-10 w-10 place-items-center rounded-full bg-ink text-paper md:hidden"
            >
              <span className="relative block h-3 w-4">
                <span className={`absolute left-0 h-px w-4 bg-current transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-px w-4 bg-current transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
              </span>
            </button>
          </div>
        </nav>
      </m.header>

      <AnimatePresence>
        {open && (
          <m.div
            className="fixed inset-0 z-[64] flex flex-col justify-between bg-ink px-6 pb-10 pt-28 text-paper md:hidden"
            initial={{ clipPath: "circle(0% at 92% 6%)" }}
            animate={{ clipPath: "circle(150% at 92% 6%)" }}
            exit={{ clipPath: "circle(0% at 92% 6%)" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <ul className="space-y-2">
              {LINKS.map((l, i) => (
                <li key={l.href} className="overflow-hidden">
                  <m.a
                    href={l.href}
                    onClick={(e) => go(e, l.href)}
                    className="flex items-baseline gap-4 font-serif text-6xl"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.15 + i * 0.06 }}
                  >
                    <span className="font-mono text-xs text-paper/40">0{i + 1}</span>
                    {l.label}
                  </m.a>
                </li>
              ))}
            </ul>
            <a href={RESUME_URL} target="_blank" rel="noreferrer" className="font-mono text-xs uppercase tracking-label text-paper/60">
              View résumé ↗
            </a>
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}
