import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Khmer fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Moul&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Dangrek&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Battambang&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Bokor&family=Moul&display=swap" rel="stylesheet"/>

        {/* Latin fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@300;400;600&display=swap" rel="stylesheet" />

        {/* Add explicit font-face definitions */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @font-face {
              font-family: 'Moul';
              font-style: normal;
              font-weight: 400;
              font-display: swap;
              src: url(https://fonts.gstatic.com/s/moul/v25/nuF2D__FSo_3E-RYiJCy.woff2) format('woff2');
              unicode-range: U+1780-17FF, U+200C, U+25CC;
            }
            
            /* Ensure consistent application of fonts */
            .khmer-heading {
              font-family: 'Moul', 'Dangrek', 'Battambang', sans-serif !important;
            }
          `
        }} />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}