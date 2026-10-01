import {
  animate,
  m,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion"
import { useEffect, useRef, useState } from "react"

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/** Each line slides up from behind a mask. */
export function Lines({
  lines,
  className = "",
  lineClassName = "",
  delay = 0,
  stagger = 0.08,
  immediate = false,
  as: Tag = "div",
}: {
  lines: React.ReactNode[]
  className?: string
  lineClassName?: string
  delay?: number
  stagger?: number
  immediate?: boolean
  as?: "div" | "h1" | "h2" | "h3" | "p"
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" })
  const show = immediate || inView
  return (
    <Tag ref={ref as any} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <m.span
            className={`block will-change-transform ${lineClassName}`}
            initial={{ y: "110%", rotate: 3 }}
            animate={show ? { y: "0%", rotate: 0 } : undefined}
            transition={{ duration: 1.1, ease: EASE, delay: delay + i * stagger }}
          >
            {line}
          </m.span>
        </span>
      ))}
    </Tag>
  )
}

/** Fade + rise when scrolled into view. */
export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 28,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </m.div>
  )
}

/** Paragraph whose words light up one by one as it scrolls through the viewport. */
export function ScrollWords({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] })
  const words = text.split(" ")
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  )
}

function Word({
  children,
  progress,
  range,
}: {
  children: string
  progress: MotionValue<number>
  range: [number, number]
}) {
  const opacity = useTransform(progress, range, [0.14, 1])
  return (
    <span className="relative mr-[0.25em] inline-block">
      <m.span style={{ opacity }}>{children}</m.span>
    </span>
  )
}

/** Number that counts up when visible. */
export function Counter({ to, suffix = "", className = "" }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration: 1.8,
      ease: EASE,
      onUpdate: (v) => setVal(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, to])
  return (
    <span ref={ref} className={className}>
      {val}
      {suffix}
    </span>
  )
}

/** Wrapper that drifts toward the pointer. */
export function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: {
  children: React.ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 })
  return (
    <m.div
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return
        const r = ref.current!.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </m.div>
  )
}

/** Pill button with a fill that rises from the bottom on hover. */
export function PillButton({
  href,
  children,
  variant = "solid",
  onClick,
  external,
  cursor,
}: {
  href?: string
  children: React.ReactNode
  variant?: "solid" | "ghost"
  onClick?: (e: React.MouseEvent) => void
  external?: boolean
  cursor?: string
}) {
  const base =
    "group relative inline-flex h-12 items-center gap-3 overflow-hidden rounded-full px-6 text-sm font-medium transition-colors duration-500"
  const styles =
    variant === "solid"
      ? "bg-accent text-white"
      : "border border-line/20 text-ink hover:text-paper"
  const fill = variant === "solid" ? "bg-ink" : "bg-ink"
  return (
    <Magnetic>
      <a
        href={href}
        onClick={onClick}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className={`${base} ${styles}`}
        data-cursor={cursor ?? ""}
      >
        <span
          className={`absolute inset-0 translate-y-full rounded-full ${fill} transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0`}
        />
        <span className={`relative z-10 flex items-center gap-3 ${variant === "solid" ? "group-hover:text-paper" : ""}`}>
          {children}
        </span>
      </a>
    </Magnetic>
  )
}
