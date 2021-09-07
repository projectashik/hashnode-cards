import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <script
          async
          src='https://feedlr.vercel.app/init.js'
          data-feedlr-project-id='f640418e-6b3d-46e7-87f8-1d507b80a373'
        ></script>
      </Head>
      <Component {...pageProps} />
      <Toaster />
    </>
  );
}
export default MyApp;
