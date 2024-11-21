import Image from 'next/image';
import Link from 'next/link';
import { colors } from './theme/colors';

const Header = ({ width, height }: { width?: string | number; height?: string | number }) => {
    return (
        <header
            css={{
                position: 'sticky',
                top: 0,
                left: 0,
                width: '100%',
                height: height ?? 60,
                backgroundColor: colors.red,
                zIndex: '100',
            }}
        >
            <div
                css={{
                    height: '100%',
                    maxWidth: width ?? 1400,
                    margin: 'auto',
                    backgroundColor: colors.red,
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0 20px',
                }}
            >
                <div
                    css={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 20,
                    }}
                >
                    <Link href='/' css={{ display: 'flex' }}>
                        <Image src='/favicon/favicon.svg' alt='logo' width={40} height={40} />
                    </Link>
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
