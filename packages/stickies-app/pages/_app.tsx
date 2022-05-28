import { MantineProvider, MantineThemeOverride } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import ConfirmModalContext from 'app/confirmPromise';
import { COLOR_SCHEMES } from 'intents/tags/constants';
import '../styles/globals.css';

const theme: Partial<MantineThemeOverride> & any = {
  colorScheme: 'dark',
  focusRing: 'auto',
  fontFamily: 'Roboto',
  colors: {
    ...COLOR_SCHEMES,
  },
};

function MyApp({ Component, pageProps }) {
  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <NotificationsProvider autoClose={4000}>
        <Component {...pageProps} />
        <ConfirmModalContext />
      </NotificationsProvider>
    </MantineProvider>
  );
}

export default MyApp;
