/** @jsxImportSource @emotion/react */
import Head from 'next/head';
import { ReactNode, useEffect, useState } from 'react';
import { GlobalTheme } from './GlobalTheme';
import Header from './Header';
import { colors } from './theme/colors';

const ScrollTopButton = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 300);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    if (!visible) return null;

    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            css={{
                position: 'fixed',
                bottom: 80,
                right: 20,
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: colors.header,
                border: `1px solid ${colors.line}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 200,
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                '&:hover': { background: colors.background2 },
                '@media (min-width: 769px)': { bottom: 24 },
            }}
        >
            <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5'>
                <polyline points='18 15 12 9 6 15' />
            </svg>
        </button>
    );
};

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

            <ScrollTopButton />

            {/* 모바일 하단 탭바 높이만큼 하단 여백 */}
            <div css={{ display: 'none', '@media (max-width: 768px)': { display: 'block', height: 64 } }} />
        </>
    );
};

export default View;
