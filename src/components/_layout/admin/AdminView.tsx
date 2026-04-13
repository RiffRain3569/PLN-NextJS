/** @jsxImportSource @emotion/react */
import Head from 'next/head';
import { ReactNode } from 'react';
import { AdminGlobalTheme } from './AdminGlobalTheme';
import AdminHeader from './AdminHeader';
import { adminColors } from './theme/colors';

const AdminView = ({ children }: { children: ReactNode }) => {
    const width = '1400px';

    return (
        <>
            <Head>
                <title>PLN Admin</title>
            </Head>
            <AdminGlobalTheme />
            <div css={{ minHeight: '100vh', backgroundColor: adminColors.background }}>
                <AdminHeader width={width} />
                <main
                    css={{
                        maxWidth: width,
                        margin: 'auto',
                        padding: '0 20px',
                    }}
                >
                    {children}
                </main>
            </div>
        </>
    );
};

export default AdminView;
