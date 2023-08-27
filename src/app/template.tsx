'use client';
import useDhl from '@hooks/useDhl';
import { Metadata } from 'next';
import { ReactNode, useEffect } from 'react';

export const metadata: Metadata = {
    title: 'buy lotto',
};

const RootTemplate = ({ children }: { children: ReactNode }) => {
    const { setReset } = useDhl();

    useEffect(() => {
        setReset(true);
    }, []);
    return <div>{children}</div>;
};
export default RootTemplate;
