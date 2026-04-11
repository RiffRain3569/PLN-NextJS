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
                    padding: '0 20px',
                }}
            >
                {children}
            </main>

            {/* 모바일 하단 탭바 높이만큼 하단 여백 */}
            <div css={{ display: 'none', '@media (max-width: 768px)': { display: 'block', height: 64 } }} />
        </>
    );
};

export default View;
