import { Html, Head, Main, NextScript } from 'next/document';
import type { MantineTheme } from '@mantine/core';
import { MantineProvider } from '@mantine/core';
import { createGetInitialProps } from '@mantine/next';



function Document() {
  return (
    <Html>
      <Head>
        <link rel='shortcut icon' href='/favicon.ico' />
        <link rel='stylesheet' href='https://fonts.googleapis.com/icon?family=Material+Icons' />
        <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto' />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

Document.getInitialProps = createGetInitialProps();

export default Document;