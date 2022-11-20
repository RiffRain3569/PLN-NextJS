import '../styles/globals.css';
import { RecoilRoot } from 'recoil';
import { useEffect } from 'react';
import useDhl from '../hooks/useDhl';

const Item = ({ Component, pageProps }) => {
    const { setReset } = useDhl();

    useEffect(() => {
        setReset(true);
    }, []);

    return <Component {...pageProps} />;
};

const MyApp = (props) => {
    return (
        <RecoilRoot>
            <Item {...props} />
        </RecoilRoot>
    );
};

export default MyApp;
