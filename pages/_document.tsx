import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* This meta tag helps prevent form auto-processing by browsers */}
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
