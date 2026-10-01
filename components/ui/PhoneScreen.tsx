import { m } from "framer-motion"
import type { ScreenKind } from "../../data/site"

/**
 * Illustrative app screens drawn in code, one per kind of product.
 * They are stylised impressions, not screenshots of the shipped apps.
 */

type Props = { kind: ScreenKind; accent: string; name: string }

const rise = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: 0.15 + i * 0.06, ease: [0.22, 1, 0.36, 1] },
})

function StatusBar({ light }: { light?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-6 pt-3 text-[11px] font-semibold ${light ? "text-white" : "text-black"}`}>
      <span>9:41</span>
      <span className="flex items-center gap-1">
        <span className="flex items-end gap-[2px]">
          {[4, 6, 8, 10].map((h) => (
            <span key={h} className="w-[3px] rounded-sm bg-current" style={{ height: h }} />
          ))}
        </span>
        <span className="ml-1 h-[10px] w-[20px] rounded-[3px] border border-current p-[1px]">
          <span className="block h-full w-3/4 rounded-[1px] bg-current" />
        </span>
      </span>
    </div>
  )
}

function Bar({ w, className = "" }: { w: string; className?: string }) {
  return <div className={`h-2 rounded-full bg-black/10 ${className}`} style={{ width: w }} />
}

function TabBar({ accent, active = 0 }: { accent: string; active?: number }) {
  return (
    <div className="absolute inset-x-0 bottom-0 flex items-center justify-around border-t border-black/5 bg-white/90 px-6 pb-6 pt-3 backdrop-blur">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="h-5 w-5 rounded-md"
          style={{ background: i === active ? accent : "rgba(0,0,0,0.12)" }}
        />
      ))}
    </div>
  )
}

export default function PhoneScreen({ kind, accent, name }: Props) {
  switch (kind) {
    case "savings":
      return (
        <div className="relative h-full bg-[#F7F5FF]">
          <div className="rounded-b-[28px] pb-6" style={{ background: accent }}>
            <StatusBar light />
            <div className="px-6 pt-5 text-white">
              <m.p {...rise(0)} className="text-xs opacity-70">Committee · Family Gold</m.p>
              <m.p {...rise(1)} className="mt-1 text-3xl font-bold">Rs 240,000</m.p>
              <m.p {...rise(2)} className="text-xs opacity-70">Your payout in round 7 of 12</m.p>
            </div>
          </div>
          <m.div {...rise(3)} className="mx-5 -mt-4 rounded-2xl bg-white p-4 shadow-lg">
            <div className="relative mx-auto h-36 w-36">
              {Array.from({ length: 12 }).map((_, i) => {
                const a = (i / 12) * Math.PI * 2 - Math.PI / 2
                return (
                  <m.span
                    key={i}
                    className="absolute h-6 w-6 rounded-full border-2 border-white"
                    style={{
                      left: `calc(50% + ${(Math.cos(a) * 56).toFixed(2)}px - 12px)`,
                      top: `calc(50% + ${(Math.sin(a) * 56).toFixed(2)}px - 12px)`,
                      background: i < 6 ? accent : i === 6 ? "#FFB020" : "#E6E1F7",
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.05, type: "spring", stiffness: 300 }}
                  />
                )
              })}
              <div className="absolute inset-0 grid place-items-center text-center">
                <div>
                  <p className="text-2xl font-bold" style={{ color: accent }}>6/12</p>
                  <p className="text-[10px] text-black/50">rounds paid</p>
                </div>
              </div>
            </div>
          </m.div>
          <div className="space-y-3 px-5 pt-5">
            {["Ayesha", "Bilal", "You"].map((n, i) => (
              <m.div key={n} {...rise(4 + i)} className="flex items-center gap-3 rounded-xl bg-white p-3">
                <span className="h-8 w-8 rounded-full" style={{ background: `${accent}${i === 2 ? "" : "55"}` }} />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-black">{n}</p>
                  <Bar w="50%" className="mt-1" />
                </div>
                <span className="text-[10px] font-semibold text-green-600">Paid</span>
              </m.div>
            ))}
          </div>
          <TabBar accent={accent} />
        </div>
      )

    case "bank":
      return (
        <div className="relative h-full bg-[#F3F7F7]">
          <StatusBar />
          <div className="px-5 pt-4">
            <m.p {...rise(0)} className="text-xs text-black/50">Good morning</m.p>
            <m.p {...rise(1)} className="text-lg font-bold text-black">Your accounts</m.p>
            <m.div
              {...rise(2)}
              className="relative mt-4 h-40 overflow-hidden rounded-2xl p-5 text-white"
              style={{ background: `linear-gradient(135deg, ${accent}, #064E4D)` }}
            >
              <span className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
              <p className="text-[10px] uppercase tracking-widest opacity-70">Salary account</p>
              <p className="mt-2 text-3xl font-bold">AED 18,420</p>
              <p className="mt-6 font-mono text-xs tracking-widest opacity-80">•••• •••• •••• 2048</p>
            </m.div>
            <div className="mt-5 grid grid-cols-4 gap-2">
              {["Send", "Pay bills", "Top up", "Cards"].map((t, i) => (
                <m.div key={t} {...rise(3 + i)} className="flex flex-col items-center gap-1.5">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-sm">
                    <span className="h-4 w-4 rounded" style={{ background: accent }} />
                  </span>
                  <span className="text-[9px] text-black/60">{t}</span>
                </m.div>
              ))}
            </div>
            <p className="mt-5 text-xs font-semibold text-black">Recent</p>
            {[
              ["DEWA", "-412.00"],
              ["Salary", "+18,000"],
              ["Etisalat", "-299.00"],
            ].map(([n, v], i) => (
              <m.div key={n} {...rise(7 + i)} className="mt-2 flex items-center justify-between rounded-xl bg-white p-3">
                <span className="flex items-center gap-2 text-xs text-black">
                  <span className="h-7 w-7 rounded-full bg-black/5" />
                  {n}
                </span>
                <span className={`text-xs font-semibold ${v.startsWith("+") ? "text-green-600" : "text-black"}`}>{v}</span>
              </m.div>
            ))}
          </div>
          <TabBar accent={accent} />
        </div>
      )

    case "dashboard":
      return (
        <div className="relative h-full bg-[#0B1220] text-white">
          <StatusBar light />
          <div className="px-5 pt-4">
            <m.p {...rise(0)} className="text-[10px] uppercase tracking-widest text-white/50">Liquidity · Today</m.p>
            <m.p {...rise(1)} className="mt-1 text-3xl font-bold">AED 2.84M</m.p>
            <m.p {...rise(2)} className="text-xs text-emerald-400">▲ 4.2% vs last week</m.p>
            <m.div {...rise(3)} className="mt-5 rounded-2xl bg-white/5 p-4">
              <svg viewBox="0 0 240 110" className="w-full">
                <defs>
                  <linearGradient id="dg" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor={accent} stopOpacity="0.5" />
                    <stop offset="1" stopColor={accent} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <m.path
                  d="M0 90 C 30 80, 40 60, 70 64 S 110 30, 140 40 S 190 20, 240 12"
                  fill="none"
                  stroke={accent}
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.4, delay: 0.3 }}
                />
                <path d="M0 90 C 30 80, 40 60, 70 64 S 110 30, 140 40 S 190 20, 240 12 V110 H0Z" fill="url(#dg)" />
              </svg>
            </m.div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                ["Inflow", "1.12M"],
                ["Outflow", "640K"],
                ["Payroll", "Due 28th"],
                ["Approvals", "3 pending"],
              ].map(([k, v], i) => (
                <m.div key={k} {...rise(4 + i)} className="rounded-xl bg-white/5 p-3">
                  <p className="text-[9px] uppercase tracking-widest text-white/40">{k}</p>
                  <p className="mt-1 text-sm font-semibold">{v}</p>
                </m.div>
              ))}
            </div>
            <div className="mt-4 flex h-16 items-end gap-1.5">
              {[30, 52, 40, 70, 48, 86, 60, 74, 92, 66].map((h, i) => (
                <m.span
                  key={i}
                  className="flex-1 rounded-t"
                  style={{ background: i === 8 ? accent : "rgba(255,255,255,0.12)" }}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.4 + i * 0.04, duration: 0.6 }}
                />
              ))}
            </div>
          </div>
        </div>
      )

    case "rewards":
      return (
        <div className="relative h-full bg-[#FFF5F9]" dir="ltr">
          <StatusBar />
          <div className="px-5 pt-4">
            <div className="flex items-center justify-between">
              <m.p {...rise(0)} className="text-lg font-bold text-black">مرحبا, Sara</m.p>
              <m.span {...rise(1)} className="rounded-full px-3 py-1 text-[10px] font-bold text-white" style={{ background: accent }}>
                2,450 pts
              </m.span>
            </div>
            <m.div {...rise(2)} className="mt-4 overflow-hidden rounded-2xl p-5 text-white" style={{ background: `linear-gradient(120deg, ${accent}, #7C3AED)` }}>
              <p className="text-[10px] uppercase tracking-widest opacity-80">This month</p>
              <p className="mt-1 text-xl font-bold">30% off at 120+ brands</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/25">
                <m.div className="h-full rounded-full bg-white" initial={{ width: 0 }} animate={{ width: "68%" }} transition={{ delay: 0.5, duration: 1 }} />
              </div>
              <p className="mt-2 text-[10px] opacity-80">550 pts to Gold</p>
            </m.div>
            <p className="mt-5 text-xs font-semibold text-black">Picked for you</p>
            <div className="mt-2 grid grid-cols-2 gap-3">
              {["#FDE68A", "#BFDBFE", "#FBCFE8", "#BBF7D0"].map((c, i) => (
                <m.div key={c} {...rise(3 + i)} className="rounded-2xl bg-white p-2 shadow-sm">
                  <div className="h-20 rounded-xl" style={{ background: c }} />
                  <Bar w="70%" className="mt-2" />
                  <p className="mt-1.5 text-[10px] font-bold" style={{ color: accent }}>
                    {[20, 15, 40, 25][i]}% off
                  </p>
                </m.div>
              ))}
            </div>
          </div>
          <TabBar accent={accent} active={1} />
        </div>
      )

    case "boarding":
      return (
        <div className="relative h-full" style={{ background: `linear-gradient(180deg, ${accent}, #B4236F)` }}>
          <StatusBar light />
          <div className="px-5 pt-5 text-white">
            <m.p {...rise(0)} className="text-xs opacity-80">Boarding pass</m.p>
            <m.p {...rise(1)} className="text-lg font-bold">Have a lovely flight</m.p>
          </div>
          <m.div {...rise(2)} className="mx-5 mt-5 overflow-hidden rounded-3xl bg-white">
            <div className="flex items-center justify-between p-5">
              <div>
                <p className="text-3xl font-black text-black">KIX</p>
                <p className="text-[10px] text-black/50">Osaka · 07:30</p>
              </div>
              <m.span
                className="text-xl"
                style={{ color: accent }}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                ✈
              </m.span>
              <div className="text-right">
                <p className="text-3xl font-black text-black">OKA</p>
                <p className="text-[10px] text-black/50">Okinawa · 09:55</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 border-t border-dashed border-black/15 px-5 py-4 text-black">
              {[
                ["Gate", "12"],
                ["Seat", "14A"],
                ["Group", "2"],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-[9px] uppercase tracking-widest text-black/40">{k}</p>
                  <p className="text-lg font-bold">{v}</p>
                </div>
              ))}
            </div>
            <div className="relative border-t border-dashed border-black/15 p-5">
              <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full" style={{ background: accent }} />
              <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-[#C83C80]" />
              <div className="mx-auto grid h-28 w-28 grid-cols-7 gap-[3px]">
                {Array.from({ length: 49 }).map((_, i) => (
                  <span key={i} className={`${(i * 7 + (i % 5) * 3) % 3 === 0 || [0, 6, 42, 48, 1, 7].includes(i) ? "bg-black" : "bg-transparent"}`} />
                ))}
              </div>
              <p className="mt-3 text-center font-mono text-[10px] text-black/50">MM 115 · 01 OCT</p>
            </div>
          </m.div>
        </div>
      )

    case "orders":
      return (
        <div className="relative h-full bg-[#F4FAF6]">
          <StatusBar />
          <div className="px-5 pt-4">
            <m.div {...rise(0)} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 shadow-sm">
              <span className="h-3 w-3 rounded-full border-2 border-black/30" />
              <span className="text-xs text-black/40">Search 10,000+ products</span>
            </m.div>
            <m.p {...rise(1)} className="mt-5 text-lg font-bold text-black">Reorder</m.p>
            {[
              ["Paracetamol 500mg", "x 24 boxes"],
              ["Amoxicillin 250mg", "x 12 boxes"],
              ["Vitamin C 1000", "x 40 boxes"],
              ["Saline 0.9%", "x 8 cartons"],
            ].map(([n, q], i) => (
              <m.div key={n} {...rise(2 + i)} className="mt-2.5 flex items-center gap-3 rounded-xl bg-white p-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg" style={{ background: `${accent}22` }}>
                  <span className="h-4 w-2 rounded-full" style={{ background: accent }} />
                </span>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-black">{n}</p>
                  <p className="text-[10px] text-black/50">{q}</p>
                </div>
                <span className="grid h-6 w-6 place-items-center rounded-full text-xs text-white" style={{ background: accent }}>
                  +
                </span>
              </m.div>
            ))}
            <m.div {...rise(7)} className="mt-5 flex items-center justify-between rounded-2xl p-4 text-white" style={{ background: accent }}>
              <div>
                <p className="text-[10px] opacity-80">4 items · delivery tomorrow</p>
                <p className="text-lg font-bold">SGD 1,284.50</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-bold" style={{ color: accent }}>
                Checkout
              </span>
            </m.div>
          </div>
        </div>
      )

    case "transit":
      return (
        <div className="relative h-full bg-[#FBF7EE]">
          <div className="relative h-[55%] overflow-hidden bg-[#EFE8D6]">
            <svg viewBox="0 0 300 340" className="absolute inset-0 h-full w-full">
              {[40, 100, 160, 220, 280].map((x) => (
                <line key={x} x1={x} y1="0" x2={x - 30} y2="340" stroke="#fff" strokeWidth="10" />
              ))}
              {[60, 140, 220, 300].map((y) => (
                <line key={y} x1="0" y1={y} x2="300" y2={y - 20} stroke="#fff" strokeWidth="8" />
              ))}
              <m.path
                d="M40 300 C 80 240, 60 200, 130 180 S 210 120, 250 60"
                fill="none"
                stroke={accent}
                strokeWidth="6"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.6, delay: 0.3 }}
              />
              <circle cx="40" cy="300" r="9" fill="#111" />
              <circle cx="250" cy="60" r="9" fill={accent} stroke="#fff" strokeWidth="4" />
            </svg>
            <div className="absolute inset-x-0 top-0">
              <StatusBar />
            </div>
          </div>
          <m.div {...rise(1)} className="-mt-6 rounded-t-3xl bg-white px-5 pt-5 shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
            <span className="mx-auto mb-4 block h-1 w-10 rounded-full bg-black/15" />
            <p className="text-lg font-bold text-black">Dubai Marina → Downtown</p>
            <p className="text-xs text-black/50">Fastest route · 32 min</p>
            <div className="mt-4 flex items-center gap-2">
              {["Walk 4", "Metro 21", "Walk 7"].map((s, i) => (
                <m.span key={s} {...rise(2 + i)}
                  className="rounded-full px-3 py-1.5 text-[10px] font-semibold"
                  style={{ background: i === 1 ? accent : "#0000000d", color: i === 1 ? "#fff" : "#000" }}
                >
                  {s}m
                </m.span>
              ))}
            </div>
            <m.div {...rise(5)} className="mt-4 flex items-center justify-between rounded-xl bg-black p-3 text-white">
              <span className="text-xs">Nol card balance</span>
              <span className="text-sm font-bold">AED 46.50</span>
            </m.div>
          </m.div>
        </div>
      )

    case "scan":
    default:
      return (
        <div className="relative h-full overflow-hidden bg-[#111]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,#3a3a3a,#0b0b0b_70%)]" />
          <StatusBar light />
          <svg viewBox="0 0 300 160" className="absolute left-1/2 top-[36%] w-[86%] -translate-x-1/2 -translate-y-1/2 opacity-90">
            <path d="M20 120 L40 80 Q60 50 110 46 L190 46 Q230 50 252 82 L280 92 Q292 96 292 112 L292 124 L20 124 Z" fill="#2b2b2b" stroke="#555" strokeWidth="2" />
            <path d="M80 80 Q95 56 120 56 L180 56 Q205 58 222 80 Z" fill="#1b1b1b" stroke="#444" />
            <circle cx="80" cy="124" r="22" fill="#0b0b0b" stroke="#666" strokeWidth="4" />
            <circle cx="232" cy="124" r="22" fill="#0b0b0b" stroke="#666" strokeWidth="4" />
          </svg>
          {/* viewfinder */}
          <div className="absolute left-1/2 top-[36%] h-44 w-60 -translate-x-1/2 -translate-y-1/2">
            {["left-0 top-0 border-l-2 border-t-2", "right-0 top-0 border-r-2 border-t-2", "left-0 bottom-0 border-b-2 border-l-2", "right-0 bottom-0 border-b-2 border-r-2"].map((c) => (
              <span key={c} className={`absolute h-6 w-6 rounded-sm ${c}`} style={{ borderColor: accent }} />
            ))}
            <m.span
              className="absolute inset-x-2 h-0.5"
              style={{ background: accent, boxShadow: `0 0 16px ${accent}` }}
              animate={{ top: ["8%", "92%", "8%"] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <m.div {...rise(3)} className="absolute inset-x-4 bottom-8 rounded-3xl bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: accent }}>
                Match · 97%
              </p>
              <p className="text-[10px] text-black/40">{name}</p>
            </div>
            <p className="mt-1 text-lg font-bold text-black">Porsche 911 Carrera</p>
            <p className="text-xs text-black/50">2019 · 992 generation · Coupé</p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              {[
                ["379", "hp"],
                ["4.2s", "0–100"],
                ["293", "km/h"],
              ].map(([v, k]) => (
                <div key={k} className="rounded-lg bg-black/5 py-2">
                  <p className="text-sm font-bold text-black">{v}</p>
                  <p className="text-[9px] text-black/50">{k}</p>
                </div>
              ))}
            </div>
          </m.div>
        </div>
      )
  }
}
