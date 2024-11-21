import Head from 'next/head';
import { ReactNode } from 'react';
import { GlobalTheme } from './GlobalTheme';
import Header from './Header';

const View = ({ children }: { children: ReactNode }) => {
    const width = '1400px';

    return (
        <>
            <Head>
                <title>PLN</title>
            </Head>

            <GlobalTheme />

            <Header width={width} />

            <main
                css={{
                    maxWidth: width,
                    margin: 'auto',
                }}
            >
                {children}
            </main>
        </>
    );
};

export default View;
