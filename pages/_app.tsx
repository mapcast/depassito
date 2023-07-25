import '@/styles/globals.css'
import type { AppProps } from 'next/app';
import wrapper  from '../redux'
import { Provider } from 'react-redux';

export default function App({ Component, pageProps }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(pageProps);
  return (
    <Provider store={store}>
        <main>
            <Component {...pageProps} />
        </main>
        <style jsx>{`
          main {
            background : #EEE;
          }
        `}</style>
    </Provider>
  )
}

//export default wrapper.withRedux(App);