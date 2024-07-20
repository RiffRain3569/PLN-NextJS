'use client';
import { ThemeProvider, createTheme } from '@mui/material';
import '@styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';
import { RecoilRoot } from 'recoil';

const queryClient = new QueryClient();

declare module '@mui/material/styles' {
    interface Palette {
        ltt0x: {
            main: string;
            dark: string;
            contrastText: string;
        };
        ltt1x: {
            main: string;
            dark: string;
            contrastText: string;
        };
        ltt2x: {
            main: string;
            dark: string;
            contrastText: string;
        };
        ltt3x: {
            main: string;
            dark: string;
            contrastText: string;
        };
        ltt4x: {
            main: string;
            dark: string;
            contrastText: string;
        };
    }

    interface PaletteOptions {
        ltt0x?: {
            main?: string;
            dark?: string;
            contrastText?: string;
        };
        ltt1x?: {
            main?: string;
            dark?: string;
            contrastText?: string;
        };
        ltt2x?: {
            main?: string;
            dark?: string;
            contrastText?: string;
        };
        ltt3x?: {
            main?: string;
            dark?: string;
            contrastText?: string;
        };
        ltt4x?: {
            main?: string;
            dark?: string;
            contrastText?: string;
        };
    }
}

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0',
            contrastText: '#fff',
        },
        secondary: {
            main: '#9c27b0',
            light: '#ba68c8',
            dark: '#7b1fa2',
            contrastText: '#fff',
        },
        ltt0x: {
            main: '#fbc400',
            dark: '#7b1fa2',
            contrastText: '#fff',
        },
        ltt1x: {
            main: '#69c8f2',
            dark: '#7b1fa2',
            contrastText: '#fff',
        },
        ltt2x: {
            main: '#ff7272',
            dark: '#7b1fa2',
            contrastText: '#fff',
        },
        ltt3x: {
            main: '#aaa',
            dark: '#7b1fa2',
            contrastText: '#fff',
        },
        ltt4x: {
            main: '#b0d840',
            dark: '#7b1fa2',
            contrastText: '#fff',
        },
    },
});

const RootLayout = ({ children }: { children: ReactNode }): ReactNode => {
    return (
        <html>
            <head>
                <title>test</title>
            </head>
            <body>
                <QueryClientProvider client={queryClient}>
                    <RecoilRoot>
                        <ThemeProvider theme={theme}>{children}</ThemeProvider>
                        <ReactQueryDevtools initialIsOpen={false} />
                    </RecoilRoot>
                </QueryClientProvider>
            </body>
        </html>
    );
};
export default RootLayout;
