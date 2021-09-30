import "../styles/globals.css";
import "../styles/nav.css";
import "../styles/id.scss";
import "../styles/mesSeries.css";

import Head from "next/head";
import Link from "next/link";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Previously On...</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav>
        <Link href="/">
          <a>Home</a>
        </Link>
        <Link href="/login">
          <a>Login</a>
        </Link>
        <Link href="/friends">
          <a>Friends</a>
        </Link>
        <Link href="/mesSeries">
          <a>Mes séries</a>
        </Link>
      </nav>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
