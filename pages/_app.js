import '../styles/globals.css';
import { RecoilRoot } from 'recoil';
import { useEffect } from 'react';
import axios from 'axios';
import useDhl from '../hooks/useDhl';

const Item = ({ Component, pageProps }) => {
    const { jsessionId, setJsessionId, setUid } = useDhl();

    useEffect(() => {
        axios({
            method: 'POST',
            url: '/api/dhl/jsessionid',
            headers: { 'Content-type': 'application/json' },
            data: { jsessionId },
        }).then((response) => {
            setJsessionId(response.data.jsessionId);
            setUid(response.data.uid);
        });
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
