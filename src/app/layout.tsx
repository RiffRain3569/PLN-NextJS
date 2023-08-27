'use client';
import '@styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';
import { RecoilRoot } from 'recoil';

const queryClient = new QueryClient();

const RootLayout = ({ children }: { children: ReactNode }): ReactNode => {
    return (
        <html>
            <head>
                <title>test</title>
            </head>
            <body>
                <QueryClientProvider client={queryClient}>
                    <RecoilRoot>
                        {children}
                        <ReactQueryDevtools initialIsOpen={false} />
                    </RecoilRoot>
                </QueryClientProvider>
            </body>
        </html>
    );
};
export default RootLayout;
