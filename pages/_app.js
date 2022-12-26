import '../styles/globals.css';
import { RecoilRoot } from 'recoil';
import { useEffect } from 'react';
import useDhl from '../hooks/useDhl';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

const queryClient = new QueryClient();

const Item = ({ Component, pageProps }) => {
    const { setReset } = useDhl();

    useEffect(() => {
        setReset(true);
    }, []);

    return <Component {...pageProps} />;
};

const MyApp = (props) => {
    return (
        <QueryClientProvider client={queryClient}>
            <RecoilRoot>
                <Item {...props} />
                {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
            </RecoilRoot>
        </QueryClientProvider>
    );
};

export default MyApp;
