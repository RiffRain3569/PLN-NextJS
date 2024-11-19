/** @jsxImportSource @emotion/react */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <RecoilRoot>
                <Component {...pageProps} />
                <ReactQueryDevtools initialIsOpen={false} />
            </RecoilRoot>
        </QueryClientProvider>
    );
}

export default MyApp;
