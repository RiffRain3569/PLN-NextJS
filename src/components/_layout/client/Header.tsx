/** @jsxImportSource @emotion/react */
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { colors } from './theme/colors';

// MUI 아이콘 대신 SVG 인라인으로 처리
const Icons = {
    home: (
        <svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
            <path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' /><polyline points='9 22 9 12 15 12 15 22' />
        </svg>
    ),
    rounds: (
        <svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
            <circle cx='12' cy='12' r='10' /><line x1='12' y1='8' x2='12' y2='12' /><line x1='12' y1='16' x2='12.01' y2='16' />
        </svg>
    ),
    predict: (
        <svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
            <polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
        </svg>
    ),
    stats: (
        <svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
            <line x1='18' y1='20' x2='18' y2='10' /><line x1='12' y1='20' x2='12' y2='4' /><line x1='6' y1='20' x2='6' y2='14' />
        </svg>
    ),
    saved: (
        <svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
            <path d='M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z' />
        </svg>
    ),
};

const NAV_ITEMS = [
    { path: '/', value: '메인', icon: Icons.home },
    { path: '/rounds', value: '당첨번호', icon: Icons.rounds },
    { path: '/predict', value: '예측', icon: Icons.predict },
    { path: '/stats', value: '분석', icon: Icons.stats },
    { path: '/saved', value: '서재', icon: Icons.saved },
];

const Header = ({ width, height }: { width?: string | number; height?: string | number }) => {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    return (
        <>
            {/* PC 상단 헤더 */}
            <header
                css={{
                    position: 'sticky',
                    top: 0,
                    width: '100%',
                    backgroundColor: colors.header,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                    zIndex: 100,
                    '@media (max-width: 768px)': { display: 'none' },
                }}
            >
                <div
                    css={{
                        height: height ?? 60,
                        maxWidth: width ?? 1400,
                        margin: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 32,
                        padding: '0 20px',
                    }}
                >
                    <Link href='/' css={{ display: 'flex', alignItems: 'center' }}>
                        <Image src='/favicon/favicon.svg' alt='logo' width={36} height={36} />
                    </Link>
                    <nav css={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                        {NAV_ITEMS.filter((el) => el.path !== '/').map((el) => {
                            const isActive = mounted && router.pathname === el.path;
                            return (
                                <Link key={el.path} href={el.path}>
                                    <span
                                        css={{
                                            fontSize: '0.9rem',
                                            fontWeight: isActive ? 'bold' : 'normal',
                                            color: isActive ? colors.white : colors.text,
                                            borderBottom: isActive ? `2px solid ${colors.white}` : '2px solid transparent',
                                            paddingBottom: 2,
                                            transition: 'all 0.2s',
                                            '&:hover': { color: colors.white },
                                        }}
                                    >
                                        {el.value}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </header>

            {/* 모바일 하단 탭바 */}
            <nav
                css={{
                    display: 'none',
                    '@media (max-width: 768px)': {
                        display: 'flex',
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        backgroundColor: colors.header,
                        borderTop: `1px solid ${colors.line}`,
                        zIndex: 100,
                    },
                }}
            >
                {NAV_ITEMS.filter((el) => el.path !== '/').map((el) => {
                    const isActive = mounted && router.pathname === el.path;
                    return (
                        <Link
                            key={el.path}
                            href={el.path}
                            css={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 4,
                                padding: '10px 0',
                                color: isActive ? colors.white : colors.text,
                                transition: 'color 0.2s',
                            }}
                        >
                            {el.icon}
                            <span css={{ fontSize: '0.65rem', fontWeight: isActive ? 'bold' : 'normal' }}>
                                {el.value}
                            </span>
                        </Link>
                    );
                })}
            </nav>

        </>
    );
};

export default Header;
