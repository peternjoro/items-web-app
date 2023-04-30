import '../styles/globals.css';
import { Provider as ReduxProvider } from 'react-redux';
import store from "../store/store";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const getLayout = Component.getLayout || ((page) => page);
  return getLayout(
    <ReduxProvider store={store}>
        <Component {...pageProps} />
    </ReduxProvider>
  )
}
export default MyApp;