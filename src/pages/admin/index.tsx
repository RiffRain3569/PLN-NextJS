import { withAdminAuth } from 'utils/adminAuth';
import { GetServerSideProps } from 'next';

const AdminIndexPage = () => null;

export const getServerSideProps: GetServerSideProps = withAdminAuth(async () => {
    return { redirect: { destination: '/admin/main', permanent: false } };
});

export default AdminIndexPage;
