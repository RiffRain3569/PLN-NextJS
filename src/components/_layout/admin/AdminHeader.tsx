/** @jsxImportSource @emotion/react */
import Txt from '@components/_ui/typography/Txt';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { adminColors } from './theme/colors';

const NAV_ITEMS = [{ path: '/admin/main', value: '자동구매' }];

const AdminHeader = ({ width, height }: { width?: string | number; height?: string | number }) => {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const logoutMutation = useMutation({
        mutationFn: async () => {
            await axios.delete('/api/admin/auth');
        },
        onSuccess: () => {
            router.push('/admin/sign-in');
        },
    });

    return (
        <header
            css={{
                position: 'sticky',
                top: 0,
                left: 0,
                width: '100%',
                backgroundColor: adminColors.header,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                zIndex: 100,
            }}
        >
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
                <div css={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                    <Txt size={16} weight='bold' css={{ color: adminColors.primary.light, letterSpacing: 2 }}>
                        ADMIN
                    </Txt>
                    <nav css={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                        {NAV_ITEMS.map((el) => {
                            const isActive = mounted && router.pathname === el.path;
                            return (
                                <Link key={el.path} href={el.path}>
                                    <Txt
                                        size={15}
                                        weight={isActive ? 'bold' : 'normal'}
                                        css={{
                                            color: adminColors.textOnHeader,
                                            borderBottom: isActive
                                                ? `2px solid ${adminColors.primary.light}`
                                                : '2px solid transparent',
                                            paddingBottom: 2,
                                            transition: 'all 0.2s',
                                            opacity: isActive ? 1 : 0.75,
                                            '&:hover': { opacity: 1 },
                                        }}
                                    >
                                        {el.value}
                                    </Txt>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <button
                    onClick={() => logoutMutation.mutate()}
                    css={{
                        background: 'none',
                        border: `1px solid ${adminColors.primary.light}`,
                        borderRadius: 4,
                        padding: '6px 14px',
                        cursor: 'pointer',
                        color: adminColors.primary.light,
                        fontSize: 13,
                        transition: 'all 0.2s',
                        '&:hover': { backgroundColor: adminColors.primary.light, color: adminColors.header },
                    }}
                >
                    로그아웃
                </button>
            </div>
        </header>
    );
};

export default AdminHeader;
