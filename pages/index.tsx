import type { NextPage } from "next"
import Head from "next/head"
import { useState } from "react"
import About from "../components/sections/About"
import BoardingPass from "../components/sections/BoardingPass"
import Contact from "../components/sections/Contact"
import Hero from "../components/sections/Hero"
import Markets from "../components/sections/Markets"
import Process from "../components/sections/Process"
import ProjectIndex from "../components/sections/ProjectIndex"
import Stack from "../components/sections/Stack"
import Work from "../components/sections/Work"
import Cursor from "../components/ui/Cursor"
import Nav from "../components/ui/Nav"
import Preloader from "../components/ui/Preloader"

const TITLE = "Muhammad Siddiq — Mobile & Full-Stack Engineer"
const DESCRIPTION =
  "Muhammad Siddiq builds mobile apps for fintech, travel and everyday life: 22 apps in production across 11 countries, in Flutter, Kotlin, Swift and React Native."

const Home: NextPage = () => {
  const [ready, setReady] = useState(false)

  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={DESCRIPTION} />
        <meta name="keywords" content="Muhammad Siddiq, Mobile Developer, Flutter, Kotlin, Swift, React Native, Full Stack, Portfolio" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:site_name" content="Muhammad Siddiq" />
        <meta property="og:url" content="https://portfolio-siddiq.vercel.app" />
        <meta property="og:type" content="website" />
        <meta name="theme-color" content="#F4F1EB" />
        <link rel="icon" href="/icons/logo.svg" />
      </Head>

      <Preloader onDone={() => setReady(true)} />
      <Cursor />
      <div className="grain" aria-hidden />
      <Nav ready={ready} />

      <main>
        <Hero ready={ready} />
        <Work />
        <Markets />
        <ProjectIndex />
        <Stack />
        <Process />
        <About />
        <BoardingPass />
        <Contact />
      </main>
    </>
  )
}

export default Home
