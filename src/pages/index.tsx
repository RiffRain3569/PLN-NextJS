import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Page = () => {
    const router = useRouter();
    useEffect(() => { router.replace('/rounds'); }, []);
    return null;
};

export default Page;
