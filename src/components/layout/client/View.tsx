import React, { ReactNode } from 'react';
import Header from './Header';

// main color

const View = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Header />
            <div
                css={{
                    backgroundColor: '#242832',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: 'calc(100vh - 60px)',
                }}
            >
                <main
                    css={{
                        width: '1400px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        color: 'white',
                    }}
                >
                    {children}
                </main>
            </div>
        </>
    );
};

export default View;
