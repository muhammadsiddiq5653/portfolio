import Head from "next/head";

type Props = {
  title: string;
  page: string;
};

const HeadSection = ({ title, page }: Props) => {
  return (
    <Head>
      <title>{title}</title>
      <meta
        http-equihttpequiv="Content-Type"
        content="text/html;charset=UTF-8"
      />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content={`${page} Page of My Portfolio`} />
      <meta
        name="keywords"
        content={`Muhammad Siddiq, Portfolio, Full Stack Developer, React, Next.js, ${page}`}
      />
      <meta property="og:title" content={title} />
      <meta property="og:site_name" content={"Muhammad Siddiq Portfolio"} />
      <meta property="og:url" content="https://portfolio-siddiq.vercel.app" />
      <meta
        property="og:description"
        content={`${page} Page of My Portfolio`}
      />
      <meta property="og:type" content="portfolio" />
      <meta property="og:image" content="" />
      <link rel="icon" href="/icons/logo.svg" />
    </Head>
  );
};

export default HeadSection;
