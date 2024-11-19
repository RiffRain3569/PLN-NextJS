import { ReactNode } from 'react';
import { GlobalTheme } from './GlobalTheme';
import Header from './Header';

const View = ({ children }: { children: ReactNode }) => {
    const width = '1400px';

    return (
        <>
            <GlobalTheme />
            <Header width={width} />
            <main
                css={{
                    width: width,
                    margin: 'auto',
                }}
            >
                {children}
            </main>
        </>
    );
};

export default View;
