const Header = ({ width, height }: { width?: string | number; height?: string | number }) => {
    return (
        <header
            css={{
                position: 'sticky',
                top: 0,
                left: 0,
                width: '100%',
                height: height ?? 60,
                backgroundColor: '#303134',
                zIndex: '100',
            }}
        >
            <div
                css={{
                    height: '100%',
                    width: width ?? 1400,
                    margin: 'auto',
                    backgroundColor: '#303134',
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
