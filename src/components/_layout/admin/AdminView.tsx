import Head from 'next/head';
import { ReactNode } from 'react';
import { AdminGlobalTheme } from './AdminGlobalTheme';
import AdminHeader from './AdminHeader';

const AdminView = ({ children }: { children: ReactNode }) => {
    const width = '1400px';

    return (
        <>
            <Head>
                <title>PLN Admin</title>
            </Head>
            <AdminGlobalTheme />
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
        </>
    );
};

export default AdminView;
