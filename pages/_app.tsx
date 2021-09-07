import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import Script from 'next/script';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        src='https://feedlr.vercel.app/init.js'
        data-feedlr-project-id='f640418e-6b3d-46e7-87f8-1d507b80a373'
        strategy='lazyOnload'
      />
      <Component {...pageProps} />
      <Toaster />
    </>
  );
}
export default MyApp;
