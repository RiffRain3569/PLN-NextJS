import Txt from '@components/_ui/typography/Txt';
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
                backgroundColor: colors.header,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                zIndex: '100',
            }}
        >
            <div
                css={{
                    height: '100%',
                    maxWidth: width ?? 1400,
                    margin: 'auto',
                    backgroundColor: colors.header,
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
                    <Link href='/components/card'>
                        <Txt size={16} weight='bold'>
                            Cards
                        </Txt>
                    </Link>
                    <Link href='/components/table'>
                        <Txt size={16} weight='bold'>
                            Tables
                        </Txt>
                    </Link>
                    <Link href='/components/input'>
                        <Txt size={16} weight='bold'>
                            Inputs
                        </Txt>
                    </Link>
                    <Link href='/components/icon'>
                        <Txt size={16} weight='bold'>
                            Icons
                        </Txt>
                    </Link>
                </div>
                <div
                    css={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Txt size={16} weight='bold'>
                        Profile
                    </Txt>
                </div>
            </div>
        </header>
    );
};

export default Header;
