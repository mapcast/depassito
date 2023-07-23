import '@/styles/globals.css'
import type { AppProps } from 'next/app';
import wrapper  from '../redux'

function App({ Component, pageProps }: AppProps) {
  return (
    <>
        <main>
            <Component {...pageProps} />
        </main>
        <style jsx>{`
          main {
            background : #EEE;
          }
        `}</style>
    </>
  )
}

export default wrapper.withRedux(App);