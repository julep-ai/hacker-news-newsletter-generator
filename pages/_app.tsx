import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Hacker News - Personalized Story Discovery</title>
        <meta name="description" content="Discover personalized Hacker News stories powered by Julep AI" />
        <link rel="icon" type="image/png" href="/logo-removebg.png" />
        <link rel="shortcut icon" type="image/png" href="/logo-removebg.png" />
        <link rel="apple-touch-icon" href="/logo-removebg.png" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}