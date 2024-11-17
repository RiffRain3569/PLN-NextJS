import React from 'react';

const Header = () => {
    return (
        <header
            css={{
                position: 'sticky',
                top: 0,
                left: 0,
                height: 60,
                background: '#303134',
                zIndex: '100',

                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <div
                css={{
                    height: '100%',
                    width: '1400px',
                    color: '#ffffff',
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <div
                    css={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                    }}
                >
                    <div>Logo</div>
                    <div>GNB</div>
                </div>
                <div
                    css={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <div>Profile</div>
                </div>
            </div>
        </header>
    );
};

export default Header;