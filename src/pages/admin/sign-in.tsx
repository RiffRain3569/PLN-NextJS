/** @jsxImportSource @emotion/react */
import { AdminGlobalTheme } from '@components/_layout/admin/AdminGlobalTheme';
import { adminColors } from '@components/_layout/admin/theme/colors';
import AdminButton from '@components/_layout/admin/ui/AdminButton';
import { Input } from '@components/_ui/input/Input';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { KeyboardEvent, useRef, useState } from 'react';

const AdminSignInPage = () => {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const [errorMsg, setErrorMsg] = useState('');

    const signInMutation = useMutation({
        mutationFn: async (password: string) => {
            await axios.post('/api/admin/auth', { password });
        },
        onSuccess: () => {
            router.replace('/admin/main');
        },
        onError: () => {
            setErrorMsg('비밀번호가 틀렸습니다.');
            if (inputRef.current) inputRef.current.value = '';
            inputRef.current?.focus();
        },
    });

    const handleSubmit = () => {
        const password = inputRef.current?.value ?? '';
        if (!password) return;
        setErrorMsg('');
        signInMutation.mutate(password);
    };

    const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
        setErrorMsg('');
        if (e.key === 'Enter') handleSubmit();
    };

    return (
        <>
            <Head>
                <title>PLN Admin</title>
            </Head>
            <AdminGlobalTheme />
            <div
                css={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: adminColors.background,
                }}
            >
                <div
                    css={{
                        width: 320,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 16,
                        padding: '40px 32px',
                        backgroundColor: '#ffffff',
                        borderRadius: 12,
                        boxShadow: '0 4px 24px rgba(22,101,52,0.12)',
                        border: `1px solid ${adminColors.line}`,
                    }}
                >
                    <div
                        css={{
                            fontSize: 22,
                            fontWeight: 'bold',
                            color: adminColors.primary.dark,
                            letterSpacing: 3,
                            textAlign: 'center',
                            marginBottom: 8,
                        }}
                    >
                        ADMIN
                    </div>

                    <Input>
                        <Input.TextField
                            ref={inputRef}
                            type='password'
                            placeholder='비밀번호'
                            onKeyUp={handleKeyUp}
                            disabled={signInMutation.isPending}
                            autoFocus
                        />
                    </Input>

                    {errorMsg && (
                        <div css={{ color: adminColors.danger, fontSize: 13, textAlign: 'center' }}>{errorMsg}</div>
                    )}

                    <AdminButton onClick={handleSubmit} loading={signInMutation.isPending}>
                        로그인
                    </AdminButton>
                </div>
            </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const token = ctx.req.cookies['admin_token'];
    if (token) {
        return { redirect: { destination: '/admin/main', permanent: false } };
    }
    return { props: {} };
};

export default AdminSignInPage;
