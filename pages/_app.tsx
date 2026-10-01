import "../styles/globals.css"
import type { AppProps } from "next/app"
import { LazyMotion, MotionConfig, domMax } from "framer-motion"
import { ThemeProvider } from "next-themes"
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google"
import SmoothScroll from "../components/ui/SmoothScroll"

const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif" })
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" })
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" })

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        :root {
          --font-serif: ${serif.style.fontFamily};
          --font-sans: ${sans.style.fontFamily};
          --font-mono: ${mono.style.fontFamily};
        }
      `}</style>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <LazyMotion features={domMax}>
          <MotionConfig reducedMotion="user">
            <SmoothScroll>
              <Component {...pageProps} />
            </SmoothScroll>
          </MotionConfig>
        </LazyMotion>
      </ThemeProvider>
    </>
  )
}

export default MyApp
