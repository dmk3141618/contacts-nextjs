import '~/globals.scss';
import type {ReactElement, ReactNode} from 'react';
import type {NextPage} from 'next';
import type {AppProps} from 'next/app';
import {ThemeProvider} from 'styled-components';
import {theme} from '~/common/theme';
import {StoreType, wrapper} from '~/common/store';
import {useStore} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({Component, pageProps}: AppPropsWithLayout) {
  const store: StoreType = useStore();
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? (page => page);
  // use redux-persis
  return (
    <PersistGate persistor={store.__persistor!} loading={<div>Loading</div>}>
      <ThemeProvider theme={theme}>{getLayout(<Component {...pageProps} />)}</ThemeProvider>;
    </PersistGate>
  );
  // do not use redux-persist
  // return <ThemeProvider theme={theme}>{getLayout(<Component {...pageProps} />)}</ThemeProvider>;
}
export default wrapper.withRedux(MyApp);
