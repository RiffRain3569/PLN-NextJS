/** @jsxImportSource @emotion/react */
import { createTheme, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import '../styles/globals.css'; // 글로벌 CSS 파일 (옵션)

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

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <RecoilRoot>
                <ThemeProvider theme={theme}>
                    <Component {...pageProps} />
                </ThemeProvider>
                <ReactQueryDevtools initialIsOpen={false} />
            </RecoilRoot>
        </QueryClientProvider>
    );
}

export default MyApp;
