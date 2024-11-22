import Txt from '@components/_ui/typography/Txt';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { colors } from './theme/colors';

const Header = ({ width, height }: { width?: string | number; height?: string | number }) => {
    const router = useRouter();
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
                    <Link href='/' css={{ display: 'flex', marginRight: 20 }}>
                        <Image src='/favicon/favicon.svg' alt='logo' width={40} height={40} />
                    </Link>
                    {[
                        { path: '/components/card', value: 'Cards' },
                        { path: '/components/table', value: 'Tables' },
                        { path: '/components/input', value: 'Inputs' },
                        { path: '/components/icon', value: 'Icons' },
                    ].map((el, idx) => (
                        <Link href={el.path} css={{ width: 60 }} key={idx}>
                            <Txt
                                size={16}
                                weight={router.pathname === el.path ? 'bold' : 'normal'}
                                css={{ '&:hover': { fontWeight: 'bold' } }}
                            >
                                {el.value}
                            </Txt>
                        </Link>
                    ))}
                </div>
                <div
                    css={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Link href={'/mypage'}>
                        <Txt
                            size={16}
                            weight={router.pathname === '/mypage' ? 'bold' : 'normal'}
                            css={{ '&:hover': { fontWeight: 'bold' } }}
                        >
                            Profile
                        </Txt>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
