/** @jsxImportSource @emotion/react */
import Txt from '@components/_ui/typography/Txt';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { colors } from './theme/colors';

const NAV_ITEMS = [
    { path: '/', value: '번호생성' },
    { path: '/rounds', value: '당첨번호' },
    { path: '/predict', value: '예측' },
    { path: '/stats', value: '분석' },
    { path: '/saved', value: '저장함' },
];

const Header = ({ width, height }: { width?: string | number; height?: string | number }) => {
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header
            css={{
                position: 'sticky',
                top: 0,
                left: 0,
                width: '100%',
                backgroundColor: colors.header,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                zIndex: 100,
            }}
        >
            {/* 메인 헤더 */}
            <div
                css={{
                    height: height ?? 60,
                    maxWidth: width ?? 1400,
                    margin: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 20px',
                }}
            >
                {/* 로고 + 데스크탑 네비게이션 */}
                <div css={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                    <Link href='/' css={{ display: 'flex', alignItems: 'center' }}>
                        <Image src='/favicon/favicon.svg' alt='logo' width={36} height={36} />
                    </Link>

                <nav
                    css={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 32,
                        '@media (max-width: 768px)': { display: 'none' },
                    }}
                >
                    {NAV_ITEMS.map((el) => {
                        const isActive = router.pathname === el.path;
                        return (
                            <Link key={el.path} href={el.path}>
                                <Txt
                                    size={15}
                                    weight={isActive ? 'bold' : 'normal'}
                                    css={{
                                        color: isActive ? colors.white : colors.text,
                                        borderBottom: isActive ? `2px solid ${colors.white}` : '2px solid transparent',
                                        paddingBottom: 2,
                                        transition: 'all 0.2s',
                                        '&:hover': { color: colors.white },
                                    }}
                                >
                                    {el.value}
                                </Txt>
                            </Link>
                        );
                    })}
                </nav>
                </div>

                {/* 모바일 햄버거 */}
                <button
                    onClick={() => setMenuOpen((v) => !v)}
                    css={{
                        display: 'none',
                        flexDirection: 'column',
                        gap: 5,
                        background: 'none',
                        padding: 4,
                        '@media (max-width: 768px)': { display: 'flex' },
                    }}
                >
                    {[0, 1, 2].map((i) => (
                        <span
                            key={i}
                            css={{
                                display: 'block',
                                width: 24,
                                height: 2,
                                backgroundColor: colors.text,
                                borderRadius: 2,
                                transition: 'all 0.2s',
                            }}
                        />
                    ))}
                </button>
            </div>

            {/* 모바일 드롭다운 메뉴 */}
            {menuOpen && (
                <nav
                    css={{
                        display: 'none',
                        '@media (max-width: 768px)': {
                            display: 'flex',
                            flexDirection: 'column',
                            borderTop: `1px solid ${colors.line}`,
                        },
                    }}
                >
                    {NAV_ITEMS.map((el) => {
                        const isActive = router.pathname === el.path;
                        return (
                            <Link
                                key={el.path}
                                href={el.path}
                                onClick={() => setMenuOpen(false)}
                                css={{
                                    padding: '14px 20px',
                                    backgroundColor: isActive ? colors.background2 : 'transparent',
                                    borderLeft: isActive ? `3px solid ${colors.white}` : '3px solid transparent',
                                }}
                            >
                                <Txt size={15} weight={isActive ? 'bold' : 'normal'}>
                                    {el.value}
                                </Txt>
                            </Link>
                        );
                    })}
                </nav>
            )}
        </header>
    );
};

export default Header;
