import '~/globals.scss';
import type {ReactElement, ReactNode} from 'react';
import type {NextPage} from 'next';
import type {AppProps} from 'next/app';
import {ThemeProvider} from 'styled-components';
import {theme} from '~/common/theme';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({Component, pageProps}: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? (page => page);
  return <ThemeProvider theme={theme}>{getLayout(<Component {...pageProps} />)}</ThemeProvider>;
}
export default MyApp;
