/** @jsxImportSource @emotion/react */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { ReactNode } from 'react';
import { RecoilRoot } from 'recoil';

const queryClient = new QueryClient();

const Wrapped = ({ children }: { children: ReactNode }) => {
    return <>{children}</>;
};

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <RecoilRoot>
                <Head>
                    <link rel='icon' type='image/png' href='/favicon/favicon-96x96.png' sizes='96x96' />
                    <link rel='icon' type='image/svg+xml' href='/favicon/favicon.svg' />
                    <link rel='shortcut icon' href='/favicon/favicon.ico' />
                    <link rel='apple-touch-icon' sizes='180x180' href='/favicon/apple-touch-icon.png' />
                    <meta name='apple-mobile-web-app-title' content='PLN' />
                    <link rel='manifest' href='/favicon/site.webmanifest' />
                    <meta name='viewport' content='width=device-width, initial-scale=1.0' />
                </Head>
                <Wrapped>
                    <Component {...pageProps} />
                </Wrapped>
                <ReactQueryDevtools initialIsOpen={false} />
            </RecoilRoot>
        </QueryClientProvider>
    );
}

export default MyApp;
