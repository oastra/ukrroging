import Head from "next/head";
import "../styles/globals.css"; // if you're using global styles

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-SBM45GGPYP"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-SBM45GGPYP');
            `,
          }}
        />

        <meta
          name="facebook-domain-verification"
          content="wgkrfydrd2rpfihgk47e2j09ebnayr"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
